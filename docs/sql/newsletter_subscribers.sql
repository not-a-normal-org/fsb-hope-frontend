-- newsletter_subscribers — email list for the newsletter band + contact form
-- (docs/plans/06). Columns match what /api/newsletter and /api/contact expect
-- (email, full_name, source, is_active) — note this differs from the doc's
-- status/subscribed_at sketch; the kept API routes are the source of truth.
--
-- Public schema, server-only writes (service-role key). RLS on, no policies.
-- Apply once per environment (already applied to the dev Supabase project).

create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  full_name   text,
  source      text,   -- which page/component captured it, for attribution
  is_active   boolean not null default true,  -- false = unsubscribed
  created_at  timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;
