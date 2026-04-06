import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { stripe } from '@/lib/stripe';

// ── Types ─────────────────────────────────────────────────────────────────────

interface PortalRequestBody {
  customerId: string;
}

// ── Route handler ─────────────────────────────────────────────────────────────

/**
 * POST /api/portal
 *
 * Creates a Stripe Customer Portal session for an existing customer.
 * The portal lets members manage their own subscription — upgrade, downgrade,
 * cancel, update payment method, and view invoices — without any custom UI.
 *
 * The portal configuration (cancellation policy, allowed products, etc.) is
 * managed in the Stripe Dashboard under Billing → Customer portal.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: PortalRequestBody;

  try {
    body = (await req.json()) as PortalRequestBody;
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 },
    );
  }

  const { customerId } = body;

  if (!customerId || typeof customerId !== 'string') {
    return NextResponse.json(
      { error: 'Missing or invalid required field: customerId' },
      { status: 400 },
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  let portalSession: Stripe.BillingPortal.Session;
  try {
    portalSession = await stripe.billingPortal.sessions.create({
      customer:   customerId,
      return_url: `${appUrl}/dashboard`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/portal] Stripe portal session creation failed:', message);
    return NextResponse.json(
      { error: `Failed to create portal session: ${message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ url: portalSession.url }, { status: 200 });
}
