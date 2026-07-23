import { NextResponse } from 'next/server';

/**
 * POST /api/admin/logout
 *
 * Clears the httpOnly admin_token cookie and redirects to the login page.
 * A server round-trip is required because JS cannot access httpOnly cookies.
 */
export async function POST(): Promise<NextResponse> {
  const res = NextResponse.json({ success: true });

  res.cookies.set('admin_token', '', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   0, // expire immediately
    path:     '/',
  });

  return res;
}
