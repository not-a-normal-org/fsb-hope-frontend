'use server';

import { revalidatePath } from 'next/cache';

import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Mark a newsletter subscriber as inactive.
 * Sets is_active=false and records the unsubscribe timestamp.
 */
export async function unsubscribeUser(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('newsletter_subscribers')
    .update({
      is_active:        false,
      unsubscribed_at:  new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to unsubscribe user: ${error.message}`);
  }

  revalidatePath('/admin/newsletter');
}
