import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import { DEFAULT_LOCALE, hasLocale, localizePath } from '@/i18n/config';

/**
 * POST /api/checkout — builds a Stripe Checkout session for one price.
 *
 * Errors come back as codes, not sentences, so the button can show them in the
 * visitor's language: `invalid_request`, `invalid_price`, `invalid_mode`,
 * `checkout_failed`. `locale` sets Stripe's own page language and sends the
 * visitor back to the same language's success/cancel page.
 */

// ── Types ─────────────────────────────────────────────────────────────────────

interface CheckoutRequestBody {
  priceId: string;
  mode: 'subscription' | 'payment';
  customerEmail?: string;
  metadata?: Record<string, string>;
  /** Internal path to return to after success/cancel (must start with "/"). */
  successPath?: string;
  cancelPath?: string;
  /** The page's language. */
  locale?: string;
}

/** Only same-origin paths — never let the client hand us an absolute URL. */
function safePath(value: unknown): string | null {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : null;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: CheckoutRequestBody;

  try {
    body = (await req.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const { priceId, mode, customerEmail, metadata } = body;
  const locale = hasLocale(body.locale) ? body.locale : DEFAULT_LOCALE;
  // Callers pass the English path; localizePath adds /de (and is a no-op on a
  // path that already has it).
  const successBase = localizePath(locale, safePath(body.successPath) ?? '/alerts?checkout=success');
  const cancelBase = localizePath(locale, safePath(body.cancelPath) ?? '/alerts');

  // 1. Validate required fields
  if (!priceId || typeof priceId !== 'string') {
    return NextResponse.json({ error: 'invalid_price' }, { status: 400 });
  }

  if (mode !== 'subscription' && mode !== 'payment') {
    return NextResponse.json({ error: 'invalid_mode' }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // 2. Build session params — subscription-only fields added conditionally
  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    payment_method_types:       ['card'],
    mode,
    line_items:                 [{ price: priceId, quantity: 1 }],
    success_url:                `${appUrl}${successBase}${successBase.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:                 `${appUrl}${cancelBase}`,
    billing_address_collection: 'required',
    // English keeps Stripe's default (the browser's language), as before.
    ...(locale === 'de' ? { locale: 'de' as const } : {}),
    ...(customerEmail ? { customer_email: customerEmail } : {}),
    ...(metadata      ? { metadata }                     : {}),
    // Promotion codes only make sense for recurring billing
    ...(mode === 'subscription' ? { allow_promotion_codes: true } : {}),
  };

  // 3. Create session
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.create(sessionParams);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/checkout] Stripe session creation failed:', message);
    // Stripe's message stays in the server log; the visitor gets a code.
    return NextResponse.json({ error: 'checkout_failed' }, { status: 500 });
  }

  return NextResponse.json({ url: session.url }, { status: 200 });
}
