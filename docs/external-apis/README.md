# External APIs

Four third-party services.

| Service | Used for | Blast radius if broken | Doc |
|---|---|---|---|
| **Stripe** | Checkout, billing portal, subscriptions, webhooks | Live money stops reconciling | [stripe.md](stripe.md) |
| **Supabase** | Postgres — customers, orders, subscriptions, newsletter | Data loss / PII exposure | [supabase.md](supabase.md) |
| **Resend** | Transactional + onboarding email | Customers get silence | [resend.md](resend.md) |
| **Cal.com** | Booking embed *and* an authenticated bookings API | A page looks empty | [cal-com.md](cal-com.md) |

Cal.com is two integrations, not one: a keyless browser embed and a
server-side REST v2 call from `/admin/appointments`. The latter is currently
dormant (no `CAL_API_KEY` set) and is easy to miss — see
[cal-com.md](cal-com.md).

## The rule for the rebuild

Rewrite freely above the integration layer. Below it, the shape is dictated by
external systems:

- Stripe's dashboard holds the webhook URL, portal config, and price IDs.
- Supabase holds tables with live rows.
- Resend holds the verified sending domain.

Changing our code does not change theirs. Any change that moves a webhook
route, renames a table, or alters a price ID has to be made in **both** places
in the same deploy.

## Environment variables

Set in `.env` / `.env.local` (both gitignored) and in the Vercel project.

### Server-only — never expose to the browser

| Var | Service | Notes |
|---|---|---|
| `STRIPE_SECRET_KEY` | Stripe | Full account access |
| `STRIPE_RESTRICTED_KEY` | Stripe | Scoped key; present but not read by app code |
| `STRIPE_WEBHOOK_SECRET` | Stripe | Signature verification; per-endpoint |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | **Bypasses all RLS** |
| `RESEND_API_KEY` | Resend | |
| `ADMIN_SECRET` | — | Admin password AND cookie value |
| `ADMIN_EMAIL` | — | Internal notification recipient; defaults to `admin@savermiles.com` |
| `CAL_API_KEY` | Cal.com | **Not currently set** — `/admin/appointments` shows a setup state without it |
| `CAL_API_VERSION` | Cal.com | Optional; defaults to `2024-08-13` |
| `MAINTENANCE_MODE` | — | Temporary. `off` disables the wall; see [maintenance-mode.md](../maintenance-mode.md) |

### Public — inlined into the browser bundle

`NEXT_PUBLIC_APP_URL` · `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ·
`NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Price IDs, all public:

    NEXT_PUBLIC_STRIPE_PRICE_EXPLORE
    NEXT_PUBLIC_STRIPE_PRICE_PLATINUM
    NEXT_PUBLIC_STRIPE_PRICE_BLACK
    NEXT_PUBLIC_STRIPE_PRICE_CONCIERGE
    NEXT_PUBLIC_STRIPE_PRICE_RESEARCH
    NEXT_PUBLIC_STRIPE_PRICE_ALERTS_ESSENTIAL_MONTHLY
    NEXT_PUBLIC_STRIPE_PRICE_ALERTS_ESSENTIAL_ANNUAL
    NEXT_PUBLIC_STRIPE_PRICE_ALERTS_PRO_MONTHLY
    NEXT_PUBLIC_STRIPE_PRICE_ALERTS_PRO_ANNUAL

`NEXT_PUBLIC_*` is compiled into client JS at build time. Never move a secret
behind that prefix to "make it work" — it publishes the secret to every
visitor. If a value is needed client-side, the answer is a server route, not a
rename.

`NEXT_PUBLIC_APP_URL` is used to build Stripe `success_url` / `cancel_url` /
`return_url`. If it is wrong in production, payments succeed and then bounce
the customer to a dead URL — a failure that never shows up locally.

## Route → service map

| Route | Stripe | Supabase | Resend |
|---|:-:|:-:|:-:|
| `POST /api/checkout` | ✓ | | |
| `POST /api/portal` | ✓ | | |
| `POST /api/profile` | ✓ | ✓ | |
| `GET /api/profile/lookup` | ✓ | ✓ | |
| `POST /api/webhooks/stripe` | ✓ | ✓ | ✓ |
| `POST /api/apply` | | ✓ | ✓ |
| `POST /api/contact` | | ✓ | ✓ |
| `POST /api/newsletter` | | ✓ | ✓ |
| `POST /api/alerts-preferences` | | | ✓ |
| `POST /api/research-intake` | | | ✓ |
| `GET /api/admin/applications-data` | | ✓ | |
| `GET /api/admin/products-data` | | ✓ | |
| `POST /api/admin/login` · `logout` | | | |

Server actions in `src/app/admin/` also call out directly:
`products/actions.ts` (Supabase) · `newsletter/actions.ts` (Supabase) ·
`subscriptions/actions.ts` (Stripe + Supabase) ·
`applications/actions.ts` (Stripe + Supabase + Resend).

Next's own docs warn that Server Functions are POSTs to the route they live on,
so a proxy matcher that excludes a path silently skips proxy coverage for its
actions. Authorization belongs **inside** each action, not only in the proxy.

## Local development

Missing keys degrade rather than crash, by design:

- **Resend** — every mail call checks for a missing key or the literal
  placeholder `your_resend_key`, then skips the send and returns success. Keep
  this; local signup flows depend on it.
- **Stripe / Supabase** — no such fallback. Their clients are constructed at
  module load with `!` non-null assertions, so a missing key fails at runtime
  on first use.

For webhooks locally:

    stripe listen --forward-to localhost:3000/api/webhooks/stripe

That prints a `whsec_…` — it is a *different* secret from the production
endpoint's. Put it in `.env.local` as `STRIPE_WEBHOOK_SECRET`.
