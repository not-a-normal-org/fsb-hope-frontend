-- customers — the app "account" record for buyers (Stripe-driven, no login).
-- Written server-side only (service-role key). Created by /api/apply (status
-- 'pending'), promoted to 'active' on profile completion (/api/profile) and on
-- Stripe checkout (webhooks/stripe). The tiered "user" type in admin user-
-- management is this table; tier is stored in `tags` (see src/lib/tiers.ts).
--
-- Columns mirror what the code reads/writes: /api/apply, /api/profile,
-- webhooks/stripe, and the /admin customers/orders/subscriptions/applications
-- pages. Public schema, RLS on with no policies (service-role only).
--
-- APPLY FIRST — subscriptions.sql and orders.sql reference this table.
-- Apply once per environment.

create table if not exists public.customers (
  id                  uuid primary key default gen_random_uuid(),
  email               text,
  full_name           text,
  phone               text,
  company_name        text,
  business_type       text,
  annual_spend_range  text,
  abn                 text,
  notes               text,
  tags                text[] not null default '{}',  -- [tier, referralSource]
  status              text not null default 'pending', -- pending|approved|active|inactive|new
  -- Unique so webhooks/stripe can upsert on it (onConflict). NULLs allowed and
  -- distinct, so apply-created rows without a Stripe id don't collide.
  stripe_customer_id  text unique,
  created_at          timestamptz not null default now()
);

alter table public.customers enable row level security;
