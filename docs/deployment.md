# Deploying to Vercel

Saver Miles is a Next.js 16 (App Router) app with Payload CMS, Supabase
(Postgres + Storage), Stripe, and Resend. Vercel auto-detects the Next.js
framework — no `vercel.json` is required.

## 1. Prerequisites

- The external services already exist (they are shared with the prior build):
  a Supabase project (Postgres + a public `media` Storage bucket + S3 access
  keys), a Stripe account with the products/prices created, and a Resend API key.
- **Node 22.** Pinned via `engines.node` in `package.json` and `.nvmrc`. Vercel
  respects `engines.node`; keep the two in sync.

## 2. Environment variables

Every key in [`.env.example`](../.env.example) except the ones marked OPTIONAL is
required for both **Build** and **Runtime**. In Vercel add them under
**Project → Settings → Environment Variables** for **Production** (and
**Preview**, if you want preview deploys to work).

Gotchas:

- **`DATABASE_URI` must be the Supabase _Transaction pooler_ (port 6543)**, not the
  Session pooler (5432), the direct 5432 string, or the service-role key. Vercel
  opens many short-lived serverless connections; the **transaction** pooler
  multiplexes them, while the session pooler is capped (~15 clients) and throws
  `EMAXCONNSESSION: max clients reached in session mode` under load — which surfaces
  as "This page couldn't load" on `/cms`, edits that never save, staff bounced back
  to the login screen, and "Login failed" on `/admin`. Payload needs this at build +
  runtime. As a safety net, in production `src/lib/database-uri.ts` moves a Supabase
  pooler URI from 5432 onto 6543 and logs a `[db]` warning — if that warning shows
  up in the Vercel logs, the env var is wrong and should be corrected. (`next dev`
  and `payload run` scripts are left alone, so a local session connection for
  one-off work still behaves as configured.)
- **`NEXT_PUBLIC_APP_URL`** must be the real production origin
  (`https://<your-domain>`), no trailing slash — it builds Stripe redirect URLs
  and email links. Do **not** leave it pointing at a `*.vercel.app` preview URL
  for production.
- `NEXT_PUBLIC_*` values are compiled into the browser bundle. Never put a secret
  behind that prefix.
- `PAYLOAD_SECRET` and `ADMIN_SECRET` should be long random strings, distinct
  from each other.

## 3. The construction wall (read before "why is my site a 503?")

`src/proxy.ts` gates the entire site: anonymous visitors get a **503 rewrite to
`/maintenance`**. It **fails closed** — the wall is up unless `MAINTENANCE_MODE`
is exactly `off`.

- **Pre-launch:** leave `MAINTENANCE_MODE` unset. To preview real pages, sign in
  at `/admin/login` with `ADMIN_SECRET`.
- **Launch:** set `MAINTENANCE_MODE=off` in Vercel and redeploy.

The Stripe webhook (`/api/webhooks/stripe`) is always exempt from the wall.

## 4. Stripe webhook

The Stripe CLI secret in local dev is not the production one. In the Stripe
dashboard register a **live** webhook endpoint pointing at
`https://<your-domain>/api/webhooks/stripe`, then set its signing secret
(`whsec_…`) as `STRIPE_WEBHOOK_SECRET` in Vercel. The route verifies the
signature, so the secret must match the endpoint.

## 5. next/image remote host

`next.config.ts` allowlists the Supabase Storage host for `next/image`. If the
Supabase project ever changes, update `images.remotePatterns` there too.

## 6. Deploy

1. Push the branch and connect the repo in Vercel (Framework preset: Next.js —
   auto-detected). Root directory: the repo root.
2. Add the environment variables (step 2).
3. Deploy. Build command / output are the Next.js defaults; don't override them.

## 7. Post-deploy smoke test

- `/maintenance` renders (200 within the page, 503 status is expected while the
  wall is up).
- Sign in at `/admin/login`; confirm `/`, `/pricing`, `/blog` load with no 500s.
- `/cms` (Payload admin) loads and can reach the database.
- Trigger a test Stripe event and confirm the webhook returns 200.
- Flip `MAINTENANCE_MODE=off` only when you're ready for the public.
