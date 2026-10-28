import { NextRequest, NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';
import { REF_COOKIE, sanitizeRefCode } from '@/lib/referral';
import { welcomeEmail } from '@/lib/welcome-email';
import { DEFAULT_LOCALE, hasLocale } from '@/i18n/config';

/**
 * POST /api/newsletter. Errors come back as codes, not sentences, so each form
 * can show them in the visitor's language: `invalid_request`, `invalid_email`,
 * `already_subscribed` (409), `server_error`.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

interface NewsletterRequestBody {
  email: string;
  name?: string;
  source?: string;
  home_airport?: string;
  /** The page's language — picks the welcome email's language. Not stored. */
  locale?: string;
}

// ── Validation ────────────────────────────────────────────────────────────────

// RFC 5322-inspired — covers all realistic email addresses without false negatives
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && EMAIL_REGEX.test(value.trim());
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: NewsletterRequestBody;

  try {
    body = (await req.json()) as NewsletterRequestBody;
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const { email, name, source, home_airport } = body;
  const locale = hasLocale(body.locale) ? body.locale : DEFAULT_LOCALE;

  // 1. Validate email
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
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
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  if (existing?.is_active) {
    return NextResponse.json({ error: 'already_subscribed' }, { status: 409 });
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
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  // 4. Send welcome email — non-fatal if it fails
  try {
    await sendEmail({ to: normalizedEmail, ...welcomeEmail(locale, name) });
  } catch (err) {
    // Log but don't fail the request — the subscriber is already saved
    console.error('[api/newsletter] Welcome email failed:', err instanceof Error ? err.message : err);
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
