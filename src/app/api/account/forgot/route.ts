import { NextRequest, NextResponse } from 'next/server';

import { getPayloadClient } from '@/lib/payload';
import { sendEmail } from '@/lib/email';

/**
 * POST /api/account/forgot — start a staff password reset.
 *
 * Payload's own email adapter isn't configured, so we call `forgotPassword` with
 * `disableEmail: true` (which returns the reset token) and send the email
 * ourselves via our Gmail mailer — the same integration the other routes use. The response
 * is ALWAYS a neutral `{ ok: true }` so we never reveal whether an account exists.
 * Exempt from the wall (PUBLIC_PATHS in proxy.ts).
 */
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest): Promise<NextResponse> {
  let email: string;
  try {
    ({ email } = (await req.json()) as { email: string });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  email = (email ?? '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  try {
    const payload = await getPayloadClient();
    const token = await payload.forgotPassword({
      collection: 'users',
      data: { email },
      disableEmail: true, // return the token instead of Payload emailing it
    });

    if (token) {
      const link = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/admin/reset-password?token=${token}`;
      await sendEmail({
        to: email,
        subject: 'Reset your Saver Miles admin password',
        html: `
          <p>We received a request to reset your Saver Miles admin password.</p>
          <p><a href="${link}">Reset your password</a> (this link is valid for one hour).</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    }
  } catch (err) {
    // Unknown email / other errors — swallow so the response stays neutral.
    console.warn('[api/account/forgot]', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ ok: true });
}
