import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';

import { stripe } from '@/lib/stripe';

// ── Types ─────────────────────────────────────────────────────────────────────

interface CheckoutRequestBody {
  priceId: string;
  mode: 'subscription' | 'payment';
  customerEmail?: string;
  metadata?: Record<string, string>;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: CheckoutRequestBody;

  try {
    body = (await req.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const { priceId, mode, customerEmail, metadata } = body;

  // 1. Validate required fields
  if (!priceId || typeof priceId !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid required field: priceId' },
      { status: 400 },
    );
  }

  if (mode !== 'subscription' && mode !== 'payment') {
    return NextResponse.json(
      { error: 'Missing or invalid required field: mode (must be "subscription" or "payment")' },
      { status: 400 },
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  // 2. Build session params — subscription-only fields added conditionally
  const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
    payment_method_types:       ['card'],
    mode,
    line_items:                 [{ price: priceId, quantity: 1 }],
    success_url:                `${appUrl}/dashboard?success=true`,
    cancel_url:                 `${appUrl}/membership`,
    billing_address_collection: 'required',
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
    return NextResponse.json(
      { error: `Failed to create checkout session: ${message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: session.url }, { status: 200 });
}
