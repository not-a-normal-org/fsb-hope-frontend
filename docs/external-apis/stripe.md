# Stripe

Live money. The highest-risk integration in the codebase — treat every change
here as production-affecting.

- SDK: `stripe` v22 (server), `@stripe/stripe-js` v9 (client)
- Client: [`src/lib/stripe.ts`](../../src/lib/stripe.ts)
- Keys: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Do not pin an older API version

`src/lib/stripe.ts` constructs the client with **no** `apiVersion`, so the
SDK's own pinned version applies. This is deliberate and commented in-file.

The webhook reads item-level `current_period_*` and `invoice.parent.*`. Those
fields exist only on the newer API. Pinning an older version returns a
different response shape and crashes those handlers **at runtime, in
production, on real payment events** — not at build time, and not in any test
that mocks Stripe.

## Two HTTP paths, on purpose

| Path | Used by | Why |
|---|---|---|
| Stripe SDK (`stripe.checkout…`) | Mutations | Ergonomics, types, signature verification |
| Raw `fetch` (`stripeFetch`) | `getActiveProducts()` | The SDK ships its own HTTP client and **bypasses the Next.js Data Cache** |

`getActiveProducts()` uses `fetch` with `next: { revalidate: 3600 }` purely so
product listings can be cached for an hour. Swapping it to the SDK "for
consistency" silently removes that cache and puts a Stripe API call on every
render.

To bust the cache on demand, add `tags: ['stripe-products']` to the fetch
options and call `revalidateTag('stripe-products')`.

`getActiveProducts()` fetches products and prices with `limit=100` and no
pagination, then maps each product to its **first** active price, skipping
products with none. Past 100 of either, results silently truncate.

## Checkout — `POST /api/checkout`

Request:

```ts
{
  priceId: string;
  mode: 'subscription' | 'payment';
  customerEmail?: string;
  metadata?: { product_key?: string; interval?: string }; // anything else is dropped
  successPath?: string; // same-origin path, e.g. '/alerts?checkout=success'
  cancelPath?: string;  // same-origin path, e.g. '/alerts/weekly'
  locale?: string;      // 'de' localizes both paths and Stripe's own page
}
```

Responds `{ url }`. Errors are codes, not sentences: `invalid_request`,
`invalid_price`, `invalid_mode` (400) and `checkout_failed` (500). On success it
creates a session with:

- `success_url`: `<origin><successPath>` plus `session_id={CHECKOUT_SESSION_ID}`,
  joined with `&` when the path already has a query string and `?` otherwise.
  `successPath` defaults to `/alerts?checkout=success`.
- `cancel_url`: `<origin><cancelPath>`, where `cancelPath` defaults to `/alerts`
- `billing_address_collection: 'required'`
- `allow_promotion_codes: true` — **subscription mode only**; promo codes are
  meaningless on one-off payments

`<origin>` is the request's own origin (`req.nextUrl.origin`, which on Vercel is
the domain the visitor is on), **not** `NEXT_PUBLIC_APP_URL`. Production had that env set to `http://localhost:3000`
until 2026-11-22, and paying customers were sent there. Paths are localized
(`/de/...`) from the request's `locale`, and must be same-origin paths.

### Session metadata

The alert checkout (`AlertBuyBox` → `CheckoutButton`) stamps `product_key`
(`weekly` / `human`) and `interval` (`monthly` / `annual`) into session
metadata, so a session reads clearly in the Stripe dashboard. The webhook does
**not** act on it: the only follow-up emails it sent were for the retired
Research Report and Seat Alert products, and those branches are gone. A new
alert purchase is recorded in the database but sends no email, to the customer
or to `ADMIN_EMAIL`.

The route keeps only those two keys, and only those values (`safeMetadata`).
Until 2026-11-22 it forwarded whatever the request sent, and the webhook trusts
`metadata.customer_id` to pick the customer row to update. A buyer could have
sent another customer's id and had their own email and Stripe id written over
that customer's row. The webhook now also ignores `customer_id` on any session
that didn't come from a Payment Link: see *resolveCustomer* below. A new key
must be added to `METADATA_VALUES` in the route, never passed through.

## Billing portal

There is no portal route. `POST /api/portal` was removed on 2026-11-22: nothing
called it, and it opened Stripe's billing portal for whatever `customerId` an
anonymous request sent, which would let anyone holding a customer id see that
customer's invoices, change their card or cancel their subscription. If
self-serve billing comes back, the route must find the customer from a signed-in
session, never from the request body.

## Webhook — `POST /api/webhooks/stripe`

The most load-bearing file in the repo. It is the sole writer for several
tables.

**Its URL is registered in the Stripe Dashboard.** Moving or renaming this
route without updating the dashboard endpoint means Stripe posts to a 404,
retries for days, then drops the events. Payments succeed; our database never
hears about them.

It is also exempt from the maintenance wall in `src/proxy.ts` — Stripe cannot
present an admin cookie. See [maintenance-mode.md](../maintenance-mode.md).

### Verification

Reads the raw body via `req.text()` — the exact bytes — then calls
`stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)`.
Anything that parses or re-serializes the body first breaks the signature.
Missing `stripe-signature` header → 400.

`STRIPE_WEBHOOK_SECRET` is **per endpoint**. The CLI's local `whsec_…` and the
production endpoint's are different values.

### Handled events

| Event | Effect |
|---|---|
| `checkout.session.completed` | Resolve customer, write `orders` / `subscriptions` (no email is sent) |
| `customer.subscription.updated` | Sync status/period to `subscriptions` |
| `customer.subscription.deleted` | Mark cancelled |
| `invoice.paid` | Record payment |
| `invoice.payment_failed` | Flag failure |

Unhandled event types fall through harmlessly — but Stripe only sends what the
dashboard endpoint subscribes to. Adding a `case` here does nothing until the
event is enabled there too.

### `resolveCustomer` — the duplicate-row trap

Approved applicants carry their internal `customer_id` in session metadata
(stamped onto the admin-generated payment link). When present, the webhook
links the Stripe customer onto that **existing** row and activates it. It reads
`customer_id` only when `session.payment_link` is set: staff create Payment
Links, while an `/api/checkout` session is built from a visitor's request.

Without linking to that row it would upsert a new row keyed only on
`stripe_customer_id`, orphaning the application row. Direct purchases carry no
`customer_id`:

- **Alert checkout** (subscription): Stripe always creates a customer, so the
  row is upserted on `stripe_customer_id`.
- **Payment Links** sent from the Stripe dashboard (e.g. a search deposit):
  one-time, `customer_creation: if_required`, so `session.customer` is `null`.
  The row is matched on email (case-insensitive) instead. Upserting on a null
  id never conflicts in Postgres, so it inserted a duplicate row per sale.

Every buyer's row is set to `active`. The table default is `pending`, which
puts a row in `/admin/applications` with an "Approve & Send Link" button.

### Best-effort lookups

`getSessionPriceId` is best-effort and returns `null` on failure. If an email
step is added back, it must stay non-fatal the same way: a failed email that
500s the webhook makes Stripe retry the event, re-run fulfilment, and re-send.

## Price IDs

Four `NEXT_PUBLIC_STRIPE_PRICE_*` vars, the alert subscriptions
(`WEEKLY_MONTHLY`/`_ANNUAL`, `HUMAN_MONTHLY`/`_ANNUAL`), read from
`process.env` in `alerts/weekly`, `alerts/human` and `lib/plans.ts`.

`lib/plans.ts` builds the **reverse** map (price ID → plan name) that the admin
orders/subscriptions views use to name a purchase. A new Stripe price must be
added there too, or the admin shows only its ID suffix. Price IDs differ between
the sandbox (local dev) and the live account (production).

## Testing

    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    stripe trigger checkout.session.completed

Test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 9995` (declined).
