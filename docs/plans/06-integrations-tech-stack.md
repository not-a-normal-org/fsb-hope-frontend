# Tech Stack & Integrations Plan

## Stack summary

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js (App Router) | Standard for this kind of marketing + light app hybrid, works cleanly with Payload's Next integration |
| CMS | Payload CMS | Confirmed choice for blog; self-hosted, code-owned schema |
| Database | Supabase (Postgres) | Confirmed choice; used both for app data (leads, subscribers, search requests) AND as Payload's Postgres adapter target — one database, not two |
| Payments | Stripe | Already wired at the account level per business setup; needs product/price config, see below |
| Styling | Tailwind CSS | Pairs cleanly with the design token system in `01-brand-design-system.md` |
| Animation | Framer Motion | Confirmed choice for page-alive feel, see motion spec in design doc |
| Scheduling | Cal.com | For business callback booking and general contact scheduling |
| Icons | Lucide | Already available in the broader component ecosystem, consistent stroke style |

**Architecture note:** Point Payload's database adapter at the same Supabase Postgres instance the app uses for leads/subscribers. This avoids running two databases for one small site and keeps everything queryable in one place. Confirm this is acceptable before scaffolding — the alternative is a separate Mongo/Postgres instance just for Payload, which is unnecessary overhead at this stage.

## Supabase schema (app data, not Payload-managed)

### `leads`
```
id                uuid, pk
type              text  -- 'individual' | 'business'
created_at        timestamptz

-- individual fields (nullable)
route             text
points_held       text

-- business fields (nullable)
yearly_spend      text
flight_need       text
points_budget     text

email             text
whatsapp          text     -- nullable, individual
phone             text     -- nullable, business
cal_booking_id    text     -- nullable, populated if business callback booked via Cal.com
status            text     -- 'new' | 'contacted' | 'searching' | 'closed', default 'new'
```

### `newsletter_subscribers`
```
id            uuid, pk
email         text, unique
subscribed_at timestamptz
source        text   -- which page/component captured it, for attribution
status        text   -- 'active' | 'unsubscribed'
```

### `alert_subscriptions`
```
id                uuid, pk
lead_id           uuid, fk -> leads (nullable, may sign up without a prior lead)
product           text     -- 'weekly_lookup' | 'human_search'
stripe_sub_id     text
status            text     -- 'active' | 'canceled' | 'past_due'
created_at        timestamptz
routes_of_interest text    -- free text, what they told us they want alerts on
```

### `search_requests`
```
id              uuid, pk
lead_id         uuid, fk -> leads
type            text    -- 'individual' | 'business'
stripe_payment_id text
deposit_status  text   -- 'paid' | 'refunded' | 'converted_to_success_fee'
outcome         text   -- 'pending' | 'found' | 'not_found'
```

Contact form submissions (`/contact`) can land in `leads` with `type = 'contact'` or a separate minimal table — either is fine, keep it simple, don't over-normalize a low-volume form.

## Payload CMS collections

### `posts` (blog)
```
title, slug, excerpt, content (rich text), publishedAt, coverImage
author: fixed constant "Saver Miles Team" — do NOT expose a real-name author field publicly
category: relationship to `categories`
```

### `categories`
Simple name/slug for blog organization.

### `deals-of-week`
```
route          text   -- "JFK → NRT"
cabin          text   -- "Business"
program        text   -- "ANA Mileage Club via Amex MR"
pointsCost     number
note           text   -- one-line value explanation
verifiedAt     date   -- powers the "valid as of" disclosure in the component
active         checkbox -- only one should be active at a time; component queries the active one
```

### `testimonials`
```
quote          textarea
attribution    text   -- client-provided name/description, with explicit publish permission per outreach plan
route          text   -- optional, what they booked
publishConsent checkbox -- must be true for the item to render on /results; enforce at query level, not just UI
```

Payload admin access should be restricted to Moon/Tanzil accounts only — this is where Deal of the Week and testimonials get updated week to week without a code deploy.

## Stripe product/price plan

| Product | Stripe object | Notes |
|---|---|---|
| Business Search | one-time Price, $25 | Charged on submission via `/business` flow |
| Individual Search — Deposit | one-time Price, $25 | Refund via Stripe refund API if search finds nothing |
| Individual Search — Success Fee | one-time Price, $99 | Charged per person per direction on confirmed booking; may need quantity/multiplier logic in checkout for multi-passenger requests |
| Weekly Lookup Alert | recurring Price, $4.99/mo | Standard Stripe subscription, cancel-anytime |
| Human Search Alert | recurring Price, $99.99/mo | Confirmed monthly recurring — safe to create in Stripe |

Use Stripe Checkout (hosted) rather than custom Elements for launch — faster to ship, PCI scope stays minimal, revisit only if a fully embedded flow becomes necessary later.

Webhook handling needed: `checkout.session.completed` (write to `search_requests` or `alert_subscriptions`), `customer.subscription.deleted` (mark alert subscription canceled), `charge.refunded` (update deposit_status).

## Cal.com integration

- Used on `/business` lead flow's final step (callback request) and on `/contact`.
- Embed via Cal.com's embed script/React component, pointed at a booking type configured for "Saver Miles intro call" (30 min default).
- On successful booking, capture the Cal.com booking UID back into the `leads.cal_booking_id` field via Cal.com's webhook or redirect callback, so the lead record and the calendar booking are linked.
- No Cal.com account/booking-type setup details are specified here — that's a manual setup step in Cal.com's dashboard, not code. Add to the build plan as a checklist item, not a code task.

## Email (newsletter + transactional)

**Chosen: Resend.** Already the live provider across the existing API routes,
sending from `hello@savermiles.com`. Reuse it (do not add a second provider).
Needed for: newsletter confirmation, lead confirmation emails ("we got your
request"), Weekly Lookup Alert's Monday delivery, and Deal of the Week email if
that becomes a newsletter content type later. `savermiles.com` must stay
verified in Resend (SPF/DKIM) before the wall comes down — verification is
external state that can lapse without a code change, and the first symptom is
silent non-delivery.

## Success-fee billing mechanics (Individual Search)

The $99 success fee is charged **later, once ops confirms a bookable award** —
not at submission. That is not hosted Checkout. Implement it as a saved payment
method captured at deposit time (Stripe SetupIntent) and charged later via a
PaymentIntent off_session, or as a Stripe Invoice sent on confirmation. Decide
before Phase 6; the deposit ($25) is ordinary Checkout, the success fee is not.

## Reconcile with the existing backend (keep & extend)

This repo already has a Stripe/Supabase/Resend integration layer and an admin
portal writing to earlier tables (`customers`, `orders`, `subscriptions`,
`applications`). Reuse the existing clients (`src/lib/stripe.ts`,
`src/lib/supabase/*`) rather than re-creating them. The new tables above
(`leads`, `search_requests`, `alert_subscriptions`, `newsletter_subscribers`)
are added **alongside** the existing ones. Before scaffolding Payload, confirm
its migrations create tables in a namespace that won't collide with the app
tables in the shared Postgres.
