'use server';

import { revalidatePath } from 'next/cache';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { CUSTOMER_TIERS, isTierTag, type CustomerTierKey } from '@/lib/tiers';

const VALID_TIERS = new Set<string>(CUSTOMER_TIERS.map((t) => t.key));

/**
 * Assign (or clear) a customer's membership tier. The tier lives as one entry in
 * `customers.tags`; we strip any existing tier tag (old or new) and prepend the
 * chosen one, leaving unrelated tags (e.g. referral source) intact. An empty
 * `tierKey` clears the tier.
 */
export async function setCustomerTier(customerId: string, tierKey: string): Promise<void> {
  if (tierKey && !VALID_TIERS.has(tierKey)) {
    throw new Error(`setCustomerTier: unknown tier "${tierKey}"`);
  }

  const { data, error: readErr } = await supabaseAdmin
    .from('customers')
    .select('tags')
    .eq('id', customerId)
    .single();

  if (readErr) throw new Error(`setCustomerTier: ${readErr.message}`);

  const existing = (data?.tags ?? []) as string[];
  const nonTierTags = existing.filter((t) => !isTierTag(t));
  const tags = tierKey ? [tierKey as CustomerTierKey, ...nonTierTags] : nonTierTags;

  const { error } = await supabaseAdmin
    .from('customers')
    .update({ tags })
    .eq('id', customerId);

  if (error) throw new Error(`setCustomerTier: ${error.message}`);
  revalidatePath('/admin/customers');
}
