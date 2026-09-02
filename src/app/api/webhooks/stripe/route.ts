import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';

// ── Disable Next.js body parsing — Stripe requires the raw bytes ──────────────
export const dynamic = 'force-dynamic';

// ── Helpers ───────────────────────────────────────────────────────────────────

function ok(message = 'ok'): NextResponse {
  return NextResponse.json({ received: true, message }, { status: 200 });
}

function bad(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

/** Fire-and-forget transactional email. No-ops if email isn't configured or no recipient. */
async function sendMail(to: string | null | undefined, subject: string, html: string): Promise<void> {
  if (!to) return;
  await sendEmail({ to, subject, html });
}

/** First active line-item price ID for a checkout session (best-effort). */
async function getSessionPriceId(sessionId: string): Promise<string | null> {
  try {
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 1 });
    return lineItems.data[0]?.price?.id ?? null;
  } catch (err) {
    console.warn('[stripe/webhook] could not read line items:', err);
    return null;
  }
}

/**
 * Post-purchase onboarding emails. Product is identified by the `product_key`
 * we stamp into session metadata from CheckoutButton. Non-fatal — a failed
 * email must not make the webhook 500 (that would retry and re-send).
 */
async function sendPurchaseFollowup(session: Stripe.Checkout.Session): Promise<void> {
  const productKey = session.metadata?.product_key;
  if (!productKey) return;

  const email = session.customer_details?.email ?? null;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? '';
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@savermiles.com';

  try {
    if (productKey === 'research') {
      const link = `${appUrl}/research/intake?session=${session.id}`;
      await sendMail(
        email,
        'Your report is next — a couple of quick details',
        `<p>Thanks for ordering a Redemption Research Report.</p>
         <p>Tell us your points balances and destinations so we can get started:</p>
         <p><a href="${link}">Complete your intake form →</a></p>
         <p>We'll deliver your report within 5 business days.</p>
         <p>— Saver Miles</p>`,
      );
      await sendMail(adminEmail, 'New Research Report purchase', `<p>Research Report purchased. Session: ${session.id}. Awaiting intake.</p>`);
    } else if (productKey.startsWith('alerts_')) {
      const link = `${appUrl}/alerts/preferences?session=${session.id}`;
      await sendMail(
        email,
        'Set up your Business Class seat alerts',
        `<p>Welcome to the Seat Alert Service.</p>
         <p>Tell us which routes and dates to monitor and we'll start watching:</p>
         <p><a href="${link}">Set your routes →</a></p>
         <p>— Saver Miles</p>`,
      );
      await sendMail(adminEmail, `New Alerts subscription (${productKey})`, `<p>New alerts subscription: ${productKey}. Session: ${session.id}.</p>`);
    }
  } catch (err) {
    console.error('[stripe/webhook] follow-up email failed:', err);
  }
}

// ── Event handlers ────────────────────────────────────────────────────────────

/**
 * Resolve the internal customer row for a completed checkout session.
 *
 * Approved applicants carry their internal `customer_id` in the session
 * metadata (stamped onto the admin payment link). When present we link the
 * Stripe customer onto that existing row and activate it — otherwise we'd
 * create a duplicate keyed only by stripe_customer_id, orphaning the
 * application row and breaking the email-keyed profile lookup.
 *
 * Direct purchases (membership/concierge buttons) carry no metadata and fall
 * back to an upsert keyed by stripe_customer_id.
 */
async function resolveCustomer(
  session: Stripe.Checkout.Session,
): Promise<{ id: string } | null> {
  const email            = session.customer_details?.email ?? null;
  const stripeCustomerId = session.customer as string;
  const linkedId         = session.metadata?.customer_id;

  if (linkedId) {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .update({
        stripe_customer_id: stripeCustomerId,
        ...(email ? { email } : {}),
        status: 'active',
      })
      .eq('id', linkedId)
      .select('id')
      .maybeSingle();

    if (error) {
      throw new Error(`customers link failed: ${error.message}`);
    }
    if (data) return data;
    // Row missing (e.g. deleted) — fall through to the upsert below.
  }

  const { data, error } = await supabaseAdmin
    .from('customers')
    .upsert(
      { stripe_customer_id: stripeCustomerId, email },
      { onConflict: 'stripe_customer_id' },
    )
    .select('id')
    .single();

  if (error) {
    throw new Error(`customers upsert failed: ${error.message}`);
  }
  return data;
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
): Promise<void> {
  const customer = await resolveCustomer(session);

  if (session.mode === 'subscription') {
    const stripeSubscriptionId = session.subscription as string;

    // Idempotency — Stripe delivers at-least-once; bail if already recorded.
    const { data: existingSub } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .maybeSingle();
    if (existingSub) return;

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

    if (subError) {
      throw new Error(`subscriptions insert failed: ${subError.message}`);
    }

    await sendPurchaseFollowup(session);
  }

  if (session.mode === 'payment') {
    // Idempotency — guard on the unique checkout session id.
    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('stripe_session_id', session.id)
      .maybeSingle();
    if (existingOrder) return;

    // Record which product was bought so the admin orders view can label it.
    const stripePriceId = await getSessionPriceId(session.id);

    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        customer_id:              customer?.id,
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_session_id:        session.id,
        stripe_price_id:          stripePriceId,
        amount_cents:             session.amount_total,
        status:                   'paid',
      });

    if (orderError) {
      throw new Error(`orders insert failed: ${orderError.message}`);
    }

    await sendPurchaseFollowup(session);
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
