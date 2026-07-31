'use server';

import { headers } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { getPayloadClient } from '@/lib/payload';
import { LEAD_STATUSES } from '@/lib/leads';

/**
 * Update the status of a lead the current account is assigned to. Unlike the
 * admin action, authorization is enforced INSIDE the action (server actions are
 * callable directly, so the /portal layout gate is not enough): the caller must
 * be an active `users` session AND the lead's `assigned_to` must equal them.
 */
export async function setMyLeadStatus(leadId: string, status: string): Promise<void> {
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) {
    throw new Error(`setMyLeadStatus: invalid status "${status}"`);
  }

  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user || user.collection !== 'users' || user.status !== 'active') {
    throw new Error('Unauthorized');
  }

  // Ownership check — never trust the client to only send its own lead ids.
  const { data: lead, error: readErr } = await supabaseAdmin
    .from('leads')
    .select('assigned_to')
    .eq('id', leadId)
    .single();
  if (readErr) throw new Error(`setMyLeadStatus: ${readErr.message}`);
  if (!lead || lead.assigned_to !== user.id) {
    throw new Error('This lead is not assigned to you.');
  }

  const { error } = await supabaseAdmin.from('leads').update({ status }).eq('id', leadId);
  if (error) throw new Error(`setMyLeadStatus: ${error.message}`);
  revalidatePath('/portal');
}
