'use server';

import { revalidatePath } from 'next/cache';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { LEAD_STATUSES } from './status';

/**
 * Admin actions over the `leads` table. `assigned_to` holds the Payload user id
 * of the searcher/agent working the lead (their portal filters on it). Reachable
 * only behind the /admin proxy gate, like every other admin action.
 */

export async function assignLead(leadId: string, assignedTo: number | null): Promise<void> {
  const { error } = await supabaseAdmin
    .from('leads')
    .update({ assigned_to: assignedTo })
    .eq('id', leadId);
  if (error) throw new Error(`assignLead: ${error.message}`);
  revalidatePath('/admin/leads');
}

export async function setLeadStatus(leadId: string, status: string): Promise<void> {
  if (!(LEAD_STATUSES as readonly string[]).includes(status)) {
    throw new Error(`setLeadStatus: invalid status "${status}"`);
  }
  const { error } = await supabaseAdmin
    .from('leads')
    .update({ status })
    .eq('id', leadId);
  if (error) throw new Error(`setLeadStatus: ${error.message}`);
  revalidatePath('/admin/leads');
}
