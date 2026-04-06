import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

// ── Disable Next.js body parsing — Stripe requires the raw bytes ──────────────
export const dynamic = 'force-dynamic';

// ── Helpers ───────────────────────────────────────────────────────────────────

function ok(message = 'ok'): NextResponse {
  return NextResponse.json({ received: true, message }, { status: 200 });
}

function bad(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

// ── Event handlers ────────────────────────────────────────────────────────────

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  // Expand customer and payment instrument so we have full objects
  const expanded = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['customer', 'subscription', 'payment_intent'],
  });

  const stripeCustomerId =
    typeof expanded.customer === 'string'
      ? expanded.customer
      : expanded.customer?.id ?? null;

  const email = expanded.customer_details?.email ?? null;

  // Always upsert the customer row first
  const { error: customerError } = await supabaseAdmin
    .from('customers')
    .upsert(
      { stripe_customer_id: stripeCustomerId, email },
      { onConflict: 'stripe_customer_id' },
    );

  if (customerError) {
    throw new Error(`customers upsert failed: ${customerError.message}`);
  }

  if (expanded.mode === 'subscription') {
    const sub =
      typeof expanded.subscription === 'string'
        ? await stripe.subscriptions.retrieve(expanded.subscription)
        : (expanded.subscription as Stripe.Subscription);

    // In Stripe SDK v22, current_period_* moved from Subscription to SubscriptionItem
    const subItem  = sub.items.data[0];
    const priceId  = subItem?.price.id ?? null;

    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        stripe_subscription_id: sub.id,
        stripe_customer_id:     stripeCustomerId,
        stripe_price_id:        priceId,
        status:                 sub.status,
        current_period_start:   subItem ? new Date(subItem.current_period_start * 1000).toISOString() : null,
        current_period_end:     subItem ? new Date(subItem.current_period_end   * 1000).toISOString() : null,
        cancel_at_period_end:   sub.cancel_at_period_end,
      });

    if (subError) {
      throw new Error(`subscriptions insert failed: ${subError.message}`);
    }
  }

  if (expanded.mode === 'payment') {
    const paymentIntentId =
      typeof expanded.payment_intent === 'string'
        ? expanded.payment_intent
        : expanded.payment_intent?.id ?? null;

    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        stripe_payment_intent_id: paymentIntentId,
        stripe_session_id:        expanded.id,
        stripe_customer_id:       stripeCustomerId,
        amount_cents:             expanded.amount_total,
        status:                   'paid',
      });

    if (orderError) {
      throw new Error(`orders insert failed: ${orderError.message}`);
    }
  }
}

async function handleSubscriptionUpdated(
  sub: Stripe.Subscription,
): Promise<void> {
  const subItem = sub.items.data[0];
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status:               sub.status,
      current_period_start: subItem ? new Date(subItem.current_period_start * 1000).toISOString() : null,
      current_period_end:   subItem ? new Date(subItem.current_period_end   * 1000).toISOString() : null,
      cancel_at_period_end: sub.cancel_at_period_end,
    })
    .eq('stripe_subscription_id', sub.id);

  if (error) {
    throw new Error(`subscription update failed: ${error.message}`);
  }
}

async function handleSubscriptionDeleted(
  sub: Stripe.Subscription,
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status:      'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', sub.id);

  if (error) {
    throw new Error(`subscription delete/cancel failed: ${error.message}`);
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const stripeCustomerId =
    typeof invoice.customer === 'string'
      ? invoice.customer
      : invoice.customer?.id ?? null;

  if (!stripeCustomerId) return;

  // Recover a subscription that had fallen into past_due
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'active' })
    .eq('stripe_customer_id', stripeCustomerId)
    .eq('status', 'past_due');

  if (error) {
    throw new Error(`invoice.paid — subscription recovery failed: ${error.message}`);
  }
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
): Promise<void> {
  const stripeCustomerId =
    typeof invoice.customer === 'string'
      ? invoice.customer
      : invoice.customer?.id ?? null;

  if (!stripeCustomerId) return;

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_customer_id', stripeCustomerId);

  if (error) {
    throw new Error(`invoice.payment_failed — status update failed: ${error.message}`);
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Read the raw body as text — Stripe's signature check needs the exact bytes
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return bad('Missing stripe-signature header');
  }

  // 2. Verify the webhook signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[stripe/webhook] Signature verification failed:', message);
    return bad(`Webhook signature verification failed: ${message}`);
  }

  // 3. Dispatch to the appropriate handler
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription,
        );
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        // Return 200 for unhandled event types — Stripe will not retry
        console.log(`[stripe/webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[stripe/webhook] Handler error for ${event.type}:`, message);
    // Return 500 so Stripe retries the delivery (transient DB errors etc.)
    return NextResponse.json(
      { error: `Handler failed: ${message}` },
      { status: 500 },
    );
  }

  return ok(event.type);
}
