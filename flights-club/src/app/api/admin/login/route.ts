import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_token';
const MAX_AGE    = 60 * 60 * 24; // 24 hours in seconds

export async function POST(req: NextRequest): Promise<NextResponse> {
  let password: string;

  try {
    ({ password } = (await req.json()) as { password: string });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!password || password !== process.env.ADMIN_SECRET) {
    // Same message for both empty and wrong — don't leak which case applies
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set(COOKIE_NAME, process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   MAX_AGE,
    path:     '/',
  });

  return res;
}
