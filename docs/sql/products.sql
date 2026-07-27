-- products — the admin-managed product catalogue (name, price, Stripe ids,
-- feature list). CRUD from the /admin products page (products/actions.ts) and
-- read by /api/admin/products-data. Public schema, RLS on, no policies.
--
-- Independent of the other tables. Apply once per environment.

create table if not exists public.products (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  description        text,
  type               text not null default 'subscription', -- subscription|one_off
  price_cents        integer not null default 0,
  billing_interval   text,             -- month|year|null (one-off)
  features           text[] not null default '{}',
  is_active          boolean not null default true,
  sort_order         integer not null default 0,
  stripe_product_id  text,
  stripe_price_id    text,
  created_at         timestamptz not null default now()
);

alter table public.products enable row level security;
