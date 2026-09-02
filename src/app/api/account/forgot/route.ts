import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

import { getPayloadClient } from '@/lib/payload';

/**
 * POST /api/account/forgot — start a staff password reset.
 *
 * Payload's own email adapter isn't configured, so we call `forgotPassword` with
 * `disableEmail: true` (which returns the reset token) and send the email
 * ourselves via Resend — the same integration the other routes use. The response
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

    const apiKey = process.env.RESEND_API_KEY;
    if (token && apiKey && apiKey !== 'your_resend_key') {
      const link = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/admin/reset-password?token=${token}`;
      await new Resend(apiKey).emails.send({
        from: 'Saver Miles <hello@savermiles.com>',
        to: email,
        subject: 'Reset your Saver Miles admin password',
        html: `
          <p>We received a request to reset your Saver Miles admin password.</p>
          <p><a href="${link}">Reset your password</a> (this link is valid for one hour).</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `,
      });
    } else if (!apiKey || apiKey === 'your_resend_key') {
      console.warn('[api/account/forgot] RESEND_API_KEY not configured — reset email skipped.');
    }
  } catch (err) {
    // Unknown email / other errors — swallow so the response stays neutral.
    console.warn('[api/account/forgot]', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ ok: true });
}
