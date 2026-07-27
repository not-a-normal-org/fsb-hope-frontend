-- orders — one-off / non-recurring Stripe payments (search fees, research
-- reports). Written by webhooks/stripe on checkout.session.completed; read by
-- the /admin orders page + dashboard (revenue). Public schema, RLS on, no
-- policies.
--
-- Apply AFTER customers.sql (customer_id references it). Apply once per env.

create table if not exists public.orders (
  id                        uuid primary key default gen_random_uuid(),
  customer_id               uuid references public.customers(id) on delete set null,
  -- Also read directly by the orders page for its customer lookup.
  stripe_customer_id        text,
  stripe_payment_intent_id  text,
  stripe_session_id         text unique,  -- idempotency: one order per checkout session
  stripe_price_id           text,
  amount_cents              integer,
  status                    text not null default 'paid', -- paid|pending|refunded|failed
  created_at                timestamptz not null default now()
);

alter table public.orders enable row level security;
