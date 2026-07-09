import { NextRequest, NextResponse } from 'next/server';

// Endpoints under the protected prefixes that must stay reachable without a token.
const PUBLIC_PATHS = new Set([
  '/admin/login',
  '/api/admin/login',
  '/api/admin/logout',
]);

export function proxy(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // Let the auth endpoints through unconditionally
  if (PUBLIC_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get('admin_token')?.value;

  if (token !== process.env.ADMIN_SECRET) {
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

  return NextResponse.next();
}

export const config = {
  // Protect admin pages AND the admin API routes. The latter were previously
  // exposed: /api/admin/* is NOT covered by the /admin/:path* pattern, so
  // applications-data and products-data leaked customer PII unauthenticated.
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
