# Supabase

Postgres holding live customer data, including PII.

- SDKs: `@supabase/supabase-js` v2, `@supabase/ssr` v0.10
- Keys: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Three clients — pick deliberately

| File | Key | Where it may be imported |
|---|---|---|
| [`admin.ts`](../../src/lib/supabase/admin.ts) | service role | Server only. **Never** in a Client Component |
| [`client.ts`](../../src/lib/supabase/client.ts) | anon | Browser (`'use client'`) |
| [`server.ts`](../../src/lib/supabase/server.ts) | anon + cookies | Server Components, actions, route handlers |

### `supabaseAdmin` bypasses all RLS

The service-role key ignores every Row Level Security policy and has
unrestricted read/write on every table. Importing `admin.ts` into anything
bundled for the browser ships that key to every visitor, handing them full
database access. There is no partial version of this mistake.

The file has no `import 'server-only'` guard — the protection is convention
alone. Adding `server-only` to it would be a cheap improvement during the
rebuild.

Note that essentially all current data access goes through `supabaseAdmin`,
not the RLS-respecting clients. **RLS policies are therefore largely untested
in practice** — do not assume they are correct just because the app works.
`client.ts` and `server.ts` exist and are wired but carry little traffic.

`admin.ts` disables `autoRefreshToken` and `persistSession`: it acts as a
service account, not on behalf of a user.

### `server.ts` and cookies

`createSupabaseServerClient()` is async and reads cookies via `next/headers`,
forwarding the session to Supabase per request. Calling it opts the caller
into dynamic rendering.

## Tables

| Table | Written by | Notes |
|---|---|---|
| `customers` | webhook, `/api/apply`, `/api/profile`, admin actions | PII: name, email |
| `subscriptions` | webhook, `admin/subscriptions` | Mirrors Stripe state |
| `orders` | webhook | One-off purchases |
| `products` | `admin/products` | Local catalogue |
| `newsletter_subscribers` | `/api/newsletter`, `/api/apply` | Export via admin CSV |
| `admin_audit_log` | admin actions | Sparse — one call site |

These live in the Supabase project and outlive this repo. The rebuild inherits
them as-is. There is no migrations directory here; the schema is whatever is
deployed. **Introspect the live database before assuming a column exists** —
this table list is derived from call sites, not from a schema dump.

The `supabase` CLI is in devDependencies but there is no `supabase/` config
directory, so it appears unused.

## `customers` is Stripe-linked

The webhook resolves rows by `session.metadata.customer_id` when present, else
upserts on `stripe_customer_id`. Two writers touch this table on different
keys — read [stripe.md](stripe.md#resolvecustomer--the-duplicate-row-trap)
before changing either path.

## PII exposure — the mistake already made once

`/api/admin/applications-data` and `/api/admin/products-data` return customer
records via `supabaseAdmin`. They are protected **only** by `src/proxy.ts`.

A previous version matched `/admin/:path*` alone. That pattern does **not**
cover `/api/admin/*` — the two endpoints served customer PII to anyone who
knew the URL. The current proxy uses a catch-all matcher and checks both
prefixes.

If you narrow the matcher during the rebuild, re-verify with an
unauthenticated request:

    curl -i https://<host>/api/admin/applications-data   # must be 401

Next's docs also warn that Server Functions are POSTs to their own route, so
proxy coverage can vanish under a matcher change. The admin server actions in
`src/app/admin/**/actions.ts` should check authorization themselves rather
than trusting the proxy.
