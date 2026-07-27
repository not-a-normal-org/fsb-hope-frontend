import { NextRequest, NextResponse } from 'next/server';

import { getPayloadClient } from '@/lib/payload';
import type { User } from '@/payload-types';

/**
 * Per-account login for internal/partner accounts (admin/agent/searcher/
 * affiliate). Authenticates against the Payload `users` collection via the local
 * API and sets Payload's own `payload-token` cookie, so `/portal` can be gated by
 * `payload.auth` in its layout. This is SEPARATE from the shared-secret admin gate
 * (`/api/admin/login` + `admin_token`) — that stays intact, so no lockout risk.
 *
 * This route is exempt from the construction wall (see PUBLIC_PATHS in proxy.ts)
 * so accounts can sign in while the marketing site is still walled.
 */

const COOKIE_NAME = 'payload-token'; // Payload's default (cookiePrefix 'payload')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FALLBACK_MAX_AGE = 60 * 60 * 2; // 2h, Payload's default token expiry

export async function POST(req: NextRequest): Promise<NextResponse> {
  let email: string;
  let password: string;
  try {
    const body = (await req.json()) as { email?: string; password?: string };
    email = String(body.email ?? '').trim().toLowerCase();
    password = String(body.password ?? '');
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  // Same generic message for bad shape and bad credentials — don't leak which.
  if (!EMAIL_RE.test(email) || !password) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  const payload = await getPayloadClient();

  let result: Awaited<ReturnType<typeof payload.login>>;
  try {
    result = await payload.login({ collection: 'users', data: { email, password } });
  } catch {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }

  // login is typed as a cross-collection union; we queried `users`.
  const user = result.user as User;
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
  }
  if (user.status !== 'active') {
    return NextResponse.json({ error: 'This account has been suspended.' }, { status: 403 });
  }
  if (!result.token) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }

  const res = NextResponse.json({ success: true, role: user.role });
  const maxAge = result.exp
    ? Math.max(0, result.exp - Math.floor(Date.now() / 1000))
    : FALLBACK_MAX_AGE;

  res.cookies.set(COOKIE_NAME, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });

  return res;
}
