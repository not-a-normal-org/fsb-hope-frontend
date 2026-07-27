-- subscriptions — Stripe subscription mirror (Weekly Lookup / Human Search Alert
-- and membership tiers). Written by webhooks/stripe (insert on checkout, updates
-- on subscription.updated / deleted / invoice paid|failed); read by the /admin
-- subscriptions page + dashboard. Public schema, RLS on, no policies.
--
-- Apply AFTER customers.sql (customer_id references it). Apply once per env.

create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  customer_id             uuid references public.customers(id) on delete set null,
  -- Also stored/read directly (the subscriptions page selects it).
  stripe_customer_id      text,
  stripe_subscription_id  text unique,
  stripe_price_id         text,
  status                  text not null default 'active', -- mirrors Stripe status
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  canceled_at             timestamptz,
  created_at              timestamptz not null default now()
);

alter table public.subscriptions enable row level security;
