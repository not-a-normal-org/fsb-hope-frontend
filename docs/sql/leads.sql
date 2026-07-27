-- leads — app-data table for the individual/business search lead flows
-- (docs/plans/06). Lives in the PUBLIC schema, alongside the kept
-- `newsletter_subscribers` (Payload's own tables are isolated in the `payload`
-- schema). Written only by the server via the service-role key; RLS is enabled
-- with NO policies, so anon/authenticated clients have no access.
--
-- Apply this once per environment (already applied to the dev Supabase project).
-- Run in the Supabase SQL editor or via psql against DATABASE_URI.

create table if not exists public.leads (
  id                uuid primary key default gen_random_uuid(),
  type              text not null check (type in ('individual', 'business', 'contact')),
  created_at        timestamptz not null default now(),

  -- individual fields (nullable)
  route             text,
  points_held       text,

  -- business fields (nullable)
  yearly_spend      text,
  flight_need       text,
  points_budget     text,

  email             text,
  whatsapp          text,   -- individual, optional
  phone             text,   -- business, optional
  cal_booking_id    text,   -- business callback booked via Cal.com (later slice)
  referral_code     text,   -- affiliate attribution (sm_ref cookie); see src/lib/referral.ts
  status            text not null default 'new',  -- new | contacted | searching | closed

  -- richer individual questionnaire answers: dates, flexibility, passengers,
  -- cabin, preferences, notes (the wizard's per-step notes)
  details           jsonb
);

-- Lock down: only the service-role key (which bypasses RLS) can read/write.
alter table public.leads enable row level security;
