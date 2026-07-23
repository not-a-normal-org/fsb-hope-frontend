# Frontend v1 archive ("pointiq")

Snapshot of the original frontend, taken before the from-scratch rebuild.
Nothing here is live: `archive/` is excluded from `tsconfig.json` and
`eslint.config.mjs`, and Next.js only routes `src/app`, not this copy.

Also recoverable from git:

    git tag    archive/frontend-v1
    git branch archive/frontend-v1

The tag is the authoritative snapshot — it includes `public/` assets and
everything else this folder omits. This copy exists so the old code stays
readable while the new frontend is built next to it.

Stack: Next.js 16.2 (App Router) · React 19.2 · Tailwind 4 · GSAP + Framer Motion.

## What must survive the rebuild

The presentation layer is disposable. The integration layer below is not —
it is the contract with Stripe, Supabase, and Resend, and the shapes it
depends on live in external systems that the rebuild does not control.

### Third-party clients — `src/lib/`

| File | Purpose | Notes |
|---|---|---|
| `stripe.ts` | Stripe SDK client, `getActiveProducts()`, `formatCurrency()` | See API-version warning below |
| `supabase/admin.ts` | Service-role client | Bypasses all RLS — server-only, never import client-side |
| `supabase/client.ts` | Browser client, anon key | Subject to RLS |
| `supabase/server.ts` | Server client, cookie-backed session | Reads/writes auth cookies via `next/headers` |

**Do not pin an older Stripe API version.** `stripe.ts` deliberately omits
`apiVersion` so the SDK's own version (v22) applies. The webhook reads
item-level `current_period_*` and `invoice.parent.*`, which exist only on the
newer API; pinning older returns a different shape and crashes those handlers
at runtime.

### API routes — `src/app/api/`

| Route | Method | Stripe | Supabase | Resend |
|---|---|:-:|:-:|:-:|
| `/api/checkout` | POST | ✓ | | |
| `/api/portal` | POST | ✓ | | |
| `/api/profile` | POST | ✓ | ✓ | |
| `/api/profile/lookup` | GET | ✓ | ✓ | |
| `/api/webhooks/stripe` | POST | ✓ | ✓ | ✓ |
| `/api/apply` | POST | | ✓ | ✓ |
| `/api/contact` | POST | | ✓ | ✓ |
| `/api/newsletter` | POST | | ✓ | ✓ |
| `/api/alerts-preferences` | POST | | | ✓ |
| `/api/research-intake` | POST | | | ✓ |
| `/api/admin/login` | POST | | | |
| `/api/admin/logout` | POST | | | |
| `/api/admin/applications-data` | GET | | ✓ | |
| `/api/admin/products-data` | GET | | ✓ | |

`/api/webhooks/stripe` is the most load-bearing file in the archive. It
handles `checkout.session.completed`, `customer.subscription.updated`,
`customer.subscription.deleted`, `invoice.paid`, and
`invoice.payment_failed`, verifies signatures via
`stripe.webhooks.constructEvent`, and is the only writer for several tables.
Its endpoint URL is registered in the Stripe dashboard — if the rebuild moves
or renames it, that registration must be updated in the same change or live
payments stop reconciling.

Routes that send mail degrade rather than fail when `RESEND_API_KEY` is unset
or still `your_resend_key` — they skip the send and return success. Keep that
behavior; local and test runs depend on it.

### Server actions — `src/app/admin/`

`products/actions.ts` (Supabase) · `newsletter/actions.ts` (Supabase) ·
`subscriptions/actions.ts` (Stripe + Supabase) ·
`applications/actions.ts` (Stripe + Supabase + Resend).

### Admin auth — `src/proxy.ts`

Gates `/admin/:path*` and `/api/admin/:path*` on the `admin_token` cookie
matching `ADMIN_SECRET`. API paths get a 401 JSON; page paths redirect to
`/admin/login`.

Both matchers are required. `/api/admin/*` is **not** covered by the
`/admin/:path*` pattern — a previous version omitted it and
`applications-data` and `products-data` leaked customer PII to unauthenticated
callers. Do not drop the second matcher in the rebuild.

### Supabase tables

`customers` · `subscriptions` · `orders` · `products` ·
`newsletter_subscribers` · `admin_audit_log`

These live in the Supabase project and outlive this repo. The rebuild inherits
them as-is unless migrated deliberately.

### Cal.com — two integrations, not one

`src/components/ui/CalEmbed.tsx` injects `https://app.cal.com/embed/embed.js`
client-side: no key, no server call, safe to redo freely.

But `src/app/admin/appointments/page.tsx` also calls the authenticated Cal.com
REST v2 API (`api.cal.com/v2/bookings`) with `CAL_API_KEY` and a pinned
`CAL_API_VERSION`. Bookings live in Cal.com, not in our database — there is no
`appointments` table, so a rebuilt admin cannot source them from Supabase.

`CAL_API_KEY` is set in neither `.env` nor `.env.local`, so that page renders a
setup state today and the integration is dormant. See
`docs/external-apis/cal-com.md`.

## Environment variables

Unchanged by the rebuild; `.env` / `.env.local` are gitignored and were not
copied here.

Server-only: `STRIPE_SECRET_KEY` · `STRIPE_RESTRICTED_KEY` ·
`STRIPE_WEBHOOK_SECRET` · `SUPABASE_SERVICE_ROLE_KEY` · `RESEND_API_KEY` ·
`ADMIN_SECRET` · `ADMIN_EMAIL`

Public: `NEXT_PUBLIC_APP_URL` · `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` ·
`NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` ·
`NEXT_PUBLIC_STRIPE_PRICE_{EXPLORE,PLATINUM,BLACK,CONCIERGE,RESEARCH}` ·
`NEXT_PUBLIC_STRIPE_PRICE_ALERTS_{ESSENTIAL,PRO}_{MONTHLY,ANNUAL}`

The price IDs are read directly from `process.env` across pages
(`membership`, `points-concierge`, `admin/orders`, `admin/subscriptions`) and
in `lib/constants.ts`. They map env → tier label; the admin pages reverse that
map to name a purchased tier. Any new pricing model needs that mapping
rebuilt, not just re-styled.

## Archived pages (disposable)

Marketing: `/` · `/about` · `/case-studies` · `/podcast` · `/research` ·
`/points-concierge` · `/membership` · `/pricing` · `/alerts` · `/contact` ·
`/privacy` · `/terms`

Flows: `/apply` → `/apply/success` · `/research/intake` ·
`/alerts/preferences` · `/dashboard`

Admin: `/admin` + `login` · `customers` · `orders` · `subscriptions` ·
`products` · `applications` · `appointments` · `newsletter`

Also archived: 12 section components, 10 UI components, 5 layout components,
`lib/constants.ts` (940 lines of copy + config), `lib/animations.ts`,
`lib/types.ts`, `app/robots.ts`, `app/sitemap.ts`, `app/globals.css`.

`lib/constants.ts` is worth reading before discarding — it is where the site's
copy, tier definitions, and FAQ content live, not just styling tokens.
