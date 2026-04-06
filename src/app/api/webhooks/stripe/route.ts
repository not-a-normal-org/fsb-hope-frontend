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
  // Use event data directly — do NOT re-fetch the session.
  // stripe trigger creates synthetic fixtures that don't exist as real sessions.
  const customerEmail    = session.customer_details?.email ?? null;
  const stripeCustomerId = session.customer as string;

  // ── DEBUG (remove after confirming Supabase writes) ───────────────────────
  console.log('SESSION DATA:', JSON.stringify({
    id:               session.id,
    mode:             session.mode,
    customer:         session.customer,
    customer_details: session.customer_details,
    subscription:     session.subscription,
    payment_intent:   session.payment_intent,
    amount_total:     session.amount_total,
  }, null, 2));
  // ─────────────────────────────────────────────────────────────────────────

  if (session.mode === 'subscription') {
    const stripeSubscriptionId = session.subscription as string;

    // Upsert customer first so we have the internal customer_id FK
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .upsert(
        { stripe_customer_id: stripeCustomerId, email: customerEmail },
        { onConflict: 'stripe_customer_id' },
      )
      .select()
      .single();

    // ── DEBUG ──────────────────────────────────────────────────────────────
    console.log('CUSTOMER RESULT:', { customer, customerError });
    // ──────────────────────────────────────────────────────────────────────

    if (customerError) {
      throw new Error(`customers upsert failed: ${customerError.message}`);
    }

    // Fetch subscription from Stripe to get period dates — this ID is real
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    // SDK v22: current_period_* live on SubscriptionItem, not Subscription
    const subItem = subscription.items.data[0];

    const { error: subError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        customer_id:            customer?.id,
        stripe_subscription_id: stripeSubscriptionId,
        stripe_price_id:        subItem?.price.id ?? null,
        status:                 subscription.status,
        current_period_start:   subItem ? new Date(subItem.current_period_start * 1000).toISOString() : null,
        current_period_end:     subItem ? new Date(subItem.current_period_end   * 1000).toISOString() : null,
        cancel_at_period_end:   subscription.cancel_at_period_end,
      });

    // ── DEBUG ────────────────────────────────────────────────────────────────
    console.log('SUBSCRIPTION INSERT ERROR:', subError);
    // ────────────────────────────────────────────────────────────────────────

    if (subError) {
      throw new Error(`subscriptions insert failed: ${subError.message}`);
    }
  }

  if (session.mode === 'payment') {
    const { data: customer, error: customerError } = await supabaseAdmin
      .from('customers')
      .upsert(
        { stripe_customer_id: stripeCustomerId, email: customerEmail },
        { onConflict: 'stripe_customer_id' },
      )
      .select()
      .single();

    // ── DEBUG ────────────────────────────────────────────────────────────────
    console.log('CUSTOMER RESULT (payment):', { customer, customerError });
    // ────────────────────────────────────────────────────────────────────────

    if (customerError) {
      throw new Error(`customers upsert failed: ${customerError.message}`);
    }

    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_id:              customer?.id,
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_session_id:        session.id,
        amount_cents:             session.amount_total,
        status:                   'paid',
      });

    // ── DEBUG ────────────────────────────────────────────────────────────────
    console.log('ORDER INSERT ERROR:', orderError);
    // ────────────────────────────────────────────────────────────────────────

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

// SDK v22: invoice.subscription moved to invoice.parent.subscription_details.subscription
function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const sub = invoice.parent?.subscription_details?.subscription;
  if (!sub) return null;
  return typeof sub === 'string' ? sub : sub.id;
}

async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  const stripeSubscriptionId = getInvoiceSubscriptionId(invoice);

  // Invoice isn't tied to a subscription (e.g. one-off invoice) — nothing to do
  if (!stripeSubscriptionId) return;

  // Recover the exact subscription that had fallen into past_due
  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'active' })
    .eq('stripe_subscription_id', stripeSubscriptionId)
    .eq('status', 'past_due');

  if (error) {
    throw new Error(`invoice.paid — subscription recovery failed: ${error.message}`);
  }
}

async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice,
): Promise<void> {
  const stripeSubscriptionId = getInvoiceSubscriptionId(invoice);

  if (!stripeSubscriptionId) return;

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', stripeSubscriptionId);

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
