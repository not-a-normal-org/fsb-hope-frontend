import { NextRequest, NextResponse } from 'next/server';

import { ADMIN_COOKIE, MAINTENANCE_ENABLED, isAdminToken } from '@/lib/maintenance';

// Endpoints that must stay reachable without a token, so an admin can get one.
const PUBLIC_PATHS = new Set([
  '/maintenance',
  '/admin/login',
  '/api/admin/login',
  '/api/admin/logout',
]);

// Stripe cannot present an admin cookie. This route authenticates itself by
// verifying the webhook signature (stripe.webhooks.constructEvent), so it is
// not unprotected — it just uses a different mechanism. Walling it off would
// silently stop live payment reconciliation: Stripe would receive 503s, retry
// for days, then drop the events.
const ALWAYS_OPEN = new Set(['/api/webhooks/stripe']);

// Crawler files. They still get walled — a 503 on robots.txt is the correct
// "whole site is down, stop crawling" signal — but they must not be handed the
// HTML notice as their body.
const TEXT_PATHS = new Set(['/robots.txt', '/sitemap.xml']);

export function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // Let the auth endpoints and the webhook through unconditionally
  if (ALWAYS_OPEN.has(pathname) || PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const isAdmin = isAdminToken(req.cookies.get(ADMIN_COOKIE)?.value);

  // ── Admin surface ───────────────────────────────────────────────────────────
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (isAdmin) {
      return NextResponse.next();
    }
    // API routes get a 401 JSON; page routes redirect to the login screen.
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Preserve the intended destination so the login page could redirect back
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Maintenance wall (TEMPORARY — see docs/maintenance-mode.md) ─────────────
  if (MAINTENANCE_ENABLED && !isAdmin) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Service unavailable — site under construction' },
        { status: 503, headers: { 'Cache-Control': 'no-store' } },
      );
    }

    if (TEXT_PATHS.has(pathname)) {
      return new NextResponse('Service unavailable — site under construction\n', {
        status:  503,
        headers: {
          'Content-Type':  'text/plain; charset=utf-8',
          'Cache-Control': 'no-store',
          'Retry-After':   '86400',
        },
      });
    }

    // Rewrite, not redirect: the visitor keeps the URL they asked for, and the
    // 503 tells crawlers "come back later" rather than letting them index the
    // notice as the site's real content.
    const url = req.nextUrl.clone();
    url.pathname = '/maintenance';
    url.search = '';
    return NextResponse.rewrite(url, {
      status: 503,
      headers: { 'Cache-Control': 'no-store', 'Retry-After': '86400' },
    });
  }

  return NextResponse.next();
}

export const config = {
  // Runs on every route except Next's build output and static assets. Image and
  // manifest extensions stay excluded so the maintenance notice can still load
  // its own logo while the rest of the site is walled off.
  //
  // The /admin and /api/admin prefixes are both covered by the catch-all below.
  // Keep it that way: /api/admin/* is NOT covered by an /admin/:path* pattern,
  // and a previous version that matched only the latter left applications-data
  // and products-data leaking customer PII unauthenticated.
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|gif|svg|webp|avif|ico|webmanifest)$).*)',
  ],
};
