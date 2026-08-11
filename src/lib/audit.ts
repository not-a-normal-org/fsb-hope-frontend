import 'server-only';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/auth';

/**
 * Append an entry to `admin_audit_log`, stamped with the acting staff member.
 *
 * The table has no actor column, so the actor is recorded inside `new_value`
 * under `_actor` (no schema migration needed). Best-effort — a logging failure
 * warns but never blocks the action. Now that /admin is per-user (see
 * src/lib/auth.ts), every mutation can record WHO did it.
 */
export async function logAudit(params: {
  action: string;
  table: string;
  recordId: string;
  detail?: Record<string, unknown>;
}): Promise<void> {
  const actor = await getCurrentUser();
  const { error } = await supabaseAdmin.from('admin_audit_log').insert({
    action: params.action,
    table_name: params.table,
    record_id: params.recordId,
    new_value: {
      ...(params.detail ?? {}),
      _actor: actor ? { id: actor.id, email: actor.email, role: actor.role } : null,
    },
  });
  if (error) console.warn('[audit] log failed:', error.message);
}
