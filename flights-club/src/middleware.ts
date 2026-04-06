import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest): NextResponse {
  const { pathname } = req.nextUrl;

  // Let the login page through unconditionally
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = req.cookies.get('admin_token')?.value;

  if (token !== process.env.ADMIN_SECRET) {
    // Preserve the intended destination so the login page could redirect back
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
