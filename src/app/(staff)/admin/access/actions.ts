'use server';

import { revalidatePath } from 'next/cache';

import { getCurrentUser } from '@/lib/auth';
import { hasRole } from '@/lib/access';
import { logAudit } from '@/lib/audit';
import { normalizeEntry } from '@/lib/region-block';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Server actions for /admin/access — add and remove `public.ip_allowlist` rows.
 *
 * The /admin layout already limits the page to admins, but a server action is a
 * public endpoint of its own, so each one checks the caller again (Next's data
 * security guidance). Every change goes to the audit log with the acting user.
 */

export type ActionResult = { ok: true } | { ok: false; error: string };

async function requireAdmin() {
  const user = await getCurrentUser();
  return user && user.status === 'active' && hasRole(user, ['admin']) ? user : null;
}

export async function addAllowlistEntry(formData: FormData): Promise<ActionResult> {
  const user = await requireAdmin();
  if (!user) return { ok: false, error: 'Only admins can change the allowlist.' };

  const entry = normalizeEntry(String(formData.get('cidr') ?? ''));
  if (!entry.ok) return entry;
  const label = String(formData.get('label') ?? '').trim().slice(0, 120) || null;

  const { data, error } = await supabaseAdmin
    .from('ip_allowlist')
    .insert({ cidr: entry.cidr, label, created_by: user.email })
    .select('id')
    .single();
  if (error) {
    if (error.code === '23505') return { ok: false, error: `${entry.cidr} is already on the list.` };
    return { ok: false, error: `Could not save: ${error.message}` };
  }

  await logAudit({
    action: 'allowlist_ip',
    table: 'ip_allowlist',
    recordId: String(data.id),
    detail: { cidr: entry.cidr, label },
  });
  revalidatePath('/admin/access');
  return { ok: true };
}

export async function removeAllowlistEntry(id: string): Promise<ActionResult> {
  const user = await requireAdmin();
  if (!user) return { ok: false, error: 'Only admins can change the allowlist.' };

  const { data, error } = await supabaseAdmin
    .from('ip_allowlist')
    .delete()
    .eq('id', id)
    .select('cidr')
    .maybeSingle();
  if (error) return { ok: false, error: `Could not remove: ${error.message}` };

  await logAudit({
    action: 'remove_allowlisted_ip',
    table: 'ip_allowlist',
    recordId: id,
    detail: { cidr: data?.cidr ?? null },
  });
  revalidatePath('/admin/access');
  return { ok: true };
}
