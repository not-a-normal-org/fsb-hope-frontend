-- ip_allowlist — addresses let through the region block (src/lib/region-block.ts).
-- Visitors located in the Indian subcontinent are served a 403 "Not available in
-- your region" page unless their IP address matches a row here. Managed by
-- admins at /admin/access; read by src/proxy.ts (PostgREST, service-role key) and
-- cached per instance for 30 seconds.
--
-- `cidr` is normalized by the app to `address/prefix`: a single IPv4 address is
-- stored as /32, a single IPv6 address as /128, and ranges keep their prefix.
-- Lives in the PUBLIC schema; RLS enabled with NO policies, so only the
-- service-role key (server-side) can read or write it.
--
-- Apply once per environment, BEFORE deploying the code that reads it — until
-- the table exists the proxy can't read the allowlist and blocks everyone in the
-- region (signed-in staff and the staff sign-in pages excepted). Run in the
-- Supabase SQL editor or via psql against DATABASE_URI.

create table if not exists public.ip_allowlist (
  id          uuid primary key default gen_random_uuid(),
  cidr        text not null unique,
  label       text,
  created_by  text,
  created_at  timestamptz not null default now()
);

alter table public.ip_allowlist enable row level security;
