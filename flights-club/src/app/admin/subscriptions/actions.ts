'use server';

import { revalidatePath } from 'next/cache';

import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Cancel an active Stripe subscription and mark it canceled in Supabase.
 * Called via Server Action from the subscriptions table cancel button.
 */
export async function cancelSubscription(
  subscriptionId: string,
  stripeSubId: string,
): Promise<void> {
  // Cancel immediately in Stripe (at_period_end=false means instant cancellation)
  await stripe.subscriptions.cancel(stripeSubId);

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({
      status:      'canceled',
      canceled_at: new Date().toISOString(),
    })
    .eq('id', subscriptionId);

  if (error) {
    throw new Error(`Failed to update subscription in DB: ${error.message}`);
  }

  revalidatePath('/admin/subscriptions');
}
