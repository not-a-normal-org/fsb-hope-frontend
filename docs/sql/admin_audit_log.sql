-- admin_audit_log — append-only trail of privileged admin actions (e.g.
-- approve/reject application). Written by admin server actions
-- (applications/actions.ts logAudit). Public schema, RLS on, no policies.
--
-- Independent of the other tables. Apply once per environment.

create table if not exists public.admin_audit_log (
  id          uuid primary key default gen_random_uuid(),
  action      text not null,       -- e.g. approve_application
  table_name  text,                -- the affected table (e.g. customers)
  record_id   text,                -- affected row id (uuid as text)
  new_value   jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

alter table public.admin_audit_log enable row level security;
