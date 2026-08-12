import { NextRequest, NextResponse } from 'next/server';

import { getPayloadClient } from '@/lib/payload';

/**
 * POST /api/account/reset — complete a staff password reset with the token from
 * the emailed link. Exempt from the wall (PUBLIC_PATHS in proxy.ts).
 */
export const dynamic = 'force-dynamic';

const MIN_PASSWORD = 8;

export async function POST(req: NextRequest): Promise<NextResponse> {
  let token: string;
  let password: string;
  try {
    ({ token, password } = (await req.json()) as { token: string; password: string });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Missing or invalid reset link.' }, { status: 400 });
  }
  if (!password || password.length < MIN_PASSWORD) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD} characters.` },
      { status: 400 },
    );
  }

  try {
    const payload = await getPayloadClient();
    await payload.resetPassword({
      collection: 'users',
      data: { token, password },
      overrideAccess: true, // no logged-in user during a reset
    });
  } catch {
    return NextResponse.json(
      { error: 'This reset link is invalid or has expired. Request a new one.' },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
