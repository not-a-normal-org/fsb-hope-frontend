import { NextRequest, NextResponse } from 'next/server';

import { MAINTENANCE_ENABLED } from '@/lib/maintenance';
import { verifyStaffToken, isActiveStaff } from '@/lib/session-edge';

// Payload's default session cookie.
const SESSION_COOKIE = 'payload-token';

// Endpoints that must stay reachable without a session, so staff can sign in.
const PUBLIC_PATHS = new Set([
  '/maintenance',
  '/admin/login',
  '/admin/reset-password',
  '/login',
  '/api/account/login',
  '/api/account/logout',
  '/api/account/forgot',
  '/api/account/reset',
]);

// Stripe cannot present a session cookie. This route authenticates itself by
// verifying the webhook signature (stripe.webhooks.constructEvent), so it is
// not unprotected — it just uses a different mechanism. Walling it off would
// silently stop live payment reconciliation.
const ALWAYS_OPEN = new Set(['/api/webhooks/stripe']);

// Crawler files. They still get walled — a 503 on robots.txt is the correct
// "whole site is down, stop crawling" signal — but must not receive the HTML notice.
const TEXT_PATHS = new Set(['/robots.txt', '/sitemap.xml']);

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  // Pass the request through, forwarding the authoritative pathname so the /admin
  // server layout can read it (per-role page gate + "auth screens render bare").
  // Overwritten unconditionally, so a client can't spoof x-pathname.
  const pass = () => {
    const headers = new Headers(req.headers);
    headers.set('x-pathname', pathname);
    return NextResponse.next({ request: { headers } });
  };

  // Let the auth endpoints and the webhook through unconditionally.
  if (ALWAYS_OPEN.has(pathname) || PUBLIC_PATHS.has(pathname)) {
    return pass();
  }

  // Fast edge pre-filter: verify the payload-token JWT (signature + expiry) and
  // read role/status from it — NO DB. This is coarse "is this an active staff
  // session"; per-role page authorization is enforced authoritatively in the
  // Node /admin layout + each page via payload.auth (which sees revocations and
  // post-login role/status changes the JWT can't).
  const staff = await verifyStaffToken(req.cookies.get(SESSION_COOKIE)?.value);
  const isStaff = isActiveStaff(staff);

  // ── Admin surface ───────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (isStaff) {
      return pass();
    }
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Account portal ──────────────────────────────────────────────────────────
  // Gated in portal/layout.tsx via payload.auth (a real, signed-session check).
  if (pathname.startsWith('/portal')) {
    return pass();
  }

  // ── Maintenance wall (TEMPORARY — see docs/maintenance-mode.md) ─────────────
  // Any active staff session bypasses the wall and sees the real site pre-launch.
  if (MAINTENANCE_ENABLED && !isStaff) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Service unavailable — site under construction' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    if (TEXT_PATHS.has(pathname)) {
      return new NextResponse('Service unavailable — site under construction\n', {
        status: 503,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
          'Retry-After': '86400',
        },
      });
    }

    const url = req.nextUrl.clone();
    url.pathname = '/maintenance';
    url.search = '';
    return NextResponse.rewrite(url, {
      status: 503,
      headers: { 'Cache-Control': 'no-store', 'Retry-After': '86400' },
    });
  }

  return pass();
}

export const config = {
  // Runs on every route except Next's build output and static assets.
  // /admin and /api/admin are both covered by the catch-all — keep it that way:
  // a previous version matching only /admin/:path* left the /api/admin/*-data
  // routes leaking customer PII unauthenticated.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|webmanifest)$).*)',
  ],
};
