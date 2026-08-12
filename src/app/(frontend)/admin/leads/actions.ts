'use server';

import { revalidatePath } from 'next/cache';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { LEAD_STATUSES } from '@/lib/leads';
import { getCurrentUser } from '@/lib/auth';
import { hasRole } from '@/lib/access';
import { logAudit } from '@/lib/audit';

/**
 * Admin actions over the `leads` table. `assigned_to` holds the Payload user id
 * of the searcher/agent working the lead (their portal filters on it). Reachable
 * only behind the /admin proxy gate, like every other admin action.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type UpdateLeadInput = {
  email?: string;
  whatsapp?: string;
  phone?: string;
  route?: string;
  flight_need?: string;
  points_held?: string;
  yearly_spend?: string;
  points_budget?: string;
  notes?: string;
};

type LeadActionResult = { ok: true } | { ok: false; error: string };

/** Trim → null on empty, capped. */
function clean(v: string | undefined, max = 2000): string | null {
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}

/**
 * Edit a lead's contact + request fields. Restricted to admin/agent — searchers
 * work leads with the customer PII redacted, so they can't edit it. The acting
 * user is recorded in the audit log.
 */
export async function updateLead(leadId: string, input: UpdateLeadInput): Promise<LeadActionResult> {
  const user = await getCurrentUser();
  if (!hasRole(user, ['admin', 'agent'])) {
    return { ok: false, error: 'You do not have permission to edit leads.' };
  }

  const email = clean(input.email, 320);
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: 'A valid email is required.' };
  }

  // Merge notes into the details jsonb, preserving the other questionnaire keys.
  const { data: existing } = await supabaseAdmin
    .from('leads')
    .select('details')
    .eq('id', leadId)
    .single();
  const details = { ...((existing?.details as Record<string, unknown> | null) ?? {}) };
  const notes = clean(input.notes);
  if (notes) details.notes = notes;
  else delete details.notes;

  const { error } = await supabaseAdmin
    .from('leads')
    .update({
      email,
      whatsapp: clean(input.whatsapp, 40),
      phone: clean(input.phone, 40),
      route: clean(input.route),
      flight_need: clean(input.flight_need),
      points_held: clean(input.points_held),
      yearly_spend: clean(input.yearly_spend),
      points_budget: clean(input.points_budget),
      details: Object.keys(details).length ? details : null,
    })
    .eq('id', leadId);
  if (error) return { ok: false, error: `Could not save: ${error.message}` };

  await logAudit({ action: 'update_lead', table: 'leads', recordId: leadId, detail: { email } });
  revalidatePath('/admin/leads');
  return { ok: true };
}

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
