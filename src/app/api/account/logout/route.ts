import { NextResponse } from 'next/server';

/** Clears the Payload account session cookie. Public (see proxy.ts PUBLIC_PATHS). */
export async function POST(): Promise<NextResponse> {
  const res = NextResponse.json({ success: true });
  res.cookies.set('payload-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
