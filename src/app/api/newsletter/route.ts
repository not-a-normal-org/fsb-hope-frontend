import { NextRequest, NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';
import { REF_COOKIE, sanitizeRefCode } from '@/lib/referral';
import { SITE_URL, SITE_LEGAL_NAME, SITE_ADDRESS_INLINE } from '@/lib/constants';

// ── Types ─────────────────────────────────────────────────────────────────────

interface NewsletterRequestBody {
  email: string;
  name?: string;
  source?: string;
  home_airport?: string;
}

// ── Validation ────────────────────────────────────────────────────────────────

// RFC 5322-inspired — covers all realistic email addresses without false negatives
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && EMAIL_REGEX.test(value.trim());
}

// ── Welcome email ─────────────────────────────────────────────────────────────

async function sendWelcomeEmail(email: string, name?: string): Promise<void> {
  const firstName = name?.split(' ')[0] ?? 'there';

  await sendEmail({
    to:      email,
    subject: 'Welcome to Saver Miles ✈',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Saver Miles</title>
</head>
<body style="margin:0;padding:0;background-color:#07090F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#07090F;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#0E1220;border-radius:16px;overflow:hidden;border:1px solid #1E2538;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 32px;border-bottom:1px solid #1E2538;">
              <p style="margin:0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#E8963A;font-weight:600;">Saver Miles</p>
              <h1 style="margin:12px 0 0;font-size:28px;font-weight:700;color:#F5F5F0;line-height:1.3;">
                Welcome aboard, ${firstName}.
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 48px;">
              <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#9DA3B4;">
                You're on the list. Saver Miles is a points-and-miles concierge: a real specialist searches award availability by hand, so you can fly premium cabins on the points you already hold. No algorithm, no guesswork — a person who does this all day.
              </p>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#9DA3B4;">
                Here's what we'll send your way:
              </p>
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:8px 0;font-size:15px;color:#F5F5F0;">
                    <span style="color:#E8963A;margin-right:10px;">✦</span>
                    Practical tips on earning and redeeming points
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:15px;color:#F5F5F0;">
                    <span style="color:#E8963A;margin-right:10px;">✦</span>
                    Business- and first-class sweet spots most travelers miss
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:15px;color:#F5F5F0;">
                    <span style="color:#E8963A;margin-right:10px;">✦</span>
                    How transfer partners and award charts actually work
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;font-size:15px;color:#F5F5F0;">
                    <span style="color:#E8963A;margin-right:10px;">✦</span>
                    The occasional standout award we spot worth flying for
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:16px;line-height:1.7;color:#9DA3B4;">
                Want a head start? Read our <a href="${SITE_URL}/blog" style="color:#E8963A;text-decoration:none;">points guides</a> or see exactly how a search works.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 48px 40px;">
              <a href="${SITE_URL}/how-it-works"
                 style="display:inline-block;background-color:#E8963A;color:#07090F;font-weight:700;font-size:15px;padding:14px 32px;border-radius:100px;text-decoration:none;letter-spacing:0.02em;">
                See how it works →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #1E2538;">
              <p style="margin:0 0 8px;font-size:13px;color:#5C6378;line-height:1.6;">
                You're receiving this because you signed up at savermiles.com.
                If this was a mistake, you can safely ignore this email.
              </p>
              <p style="margin:0;font-size:12px;color:#5C6378;line-height:1.6;">
                ${SITE_LEGAL_NAME} · ${SITE_ADDRESS_INLINE}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  });
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: NewsletterRequestBody;

  try {
    body = (await req.json()) as NewsletterRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { email, name, source, home_airport } = body;

  // 1. Validate email
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'Invalid email address' },
      { status: 400 },
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  // 2. Check for an existing active subscriber before upsert
  const { data: existing, error: lookupError } = await supabaseAdmin
    .from('newsletter_subscribers')
    .select('id, is_active')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (lookupError) {
    console.error('[api/newsletter] Subscriber lookup failed:', lookupError.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  if (existing?.is_active) {
    return NextResponse.json(
      { error: 'Already subscribed' },
      { status: 409 },
    );
  }

  // Attribution: only set when present, so a re-subscribe never nulls an
  // existing referral_code (an omitted column is untouched on conflict update).
  const referralCode = sanitizeRefCode(req.cookies.get(REF_COOKIE)?.value);

  // 3. Upsert — handles the re-subscribe case (was inactive, now active again)
  const { error: upsertError } = await supabaseAdmin
    .from('newsletter_subscribers')
    .upsert(
      {
        email:        normalizedEmail,
        full_name:    name?.trim() || null,
        source:       source?.trim() || null,
        home_airport: home_airport?.trim().slice(0, 120) || null,
        is_active:    true,
        ...(referralCode ? { referral_code: referralCode } : {}),
      },
      { onConflict: 'email' },
    );

  if (upsertError) {
    console.error('[api/newsletter] Upsert failed:', upsertError.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

  // 4. Send welcome email — non-fatal if it fails
  try {
    await sendWelcomeEmail(normalizedEmail, name);
  } catch (err) {
    // Log but don't fail the request — the subscriber is already saved
    console.error('[api/newsletter] Welcome email failed:', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
