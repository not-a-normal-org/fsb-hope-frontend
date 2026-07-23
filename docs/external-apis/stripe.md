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
  metadata?: Record<string, string>;
}
```

Responds `{ sessionId, url }`. Validates `priceId` and `mode` (400 on bad
input), then creates a session with:

- `success_url`: `${NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`
- `cancel_url`: `${NEXT_PUBLIC_APP_URL}/membership`
- `billing_address_collection: 'required'`
- `allow_promotion_codes: true` — **subscription mode only**; promo codes are
  meaningless on one-off payments

> **Both redirect targets are deleted pages.** `/dashboard` and `/membership`
> no longer exist. Unreachable today (the wall 503s the public), but a launch
> blocker — see [../README.md](../README.md#dangling-references--read-before-launch).

### `metadata.product_key` drives fulfilment

Something stamps a `product_key` into session metadata; the webhook reads it
back to decide which onboarding email to send. Known values:

| `product_key` | Post-purchase action |
|---|---|
| `research` | Emails a link to `/research/intake?session=…` |
| `alerts_essential`, `alerts_pro` | Emails a link to `/alerts/preferences?session=…` |
| `concierge` | No follow-up email |

Drop the metadata and checkout still succeeds — the customer just never gets
their intake link, and nobody finds out until they complain. It is an
invisible coupling between a caller's prop and a webhook branch.

> **This coupling is currently broken.** `CheckoutButton`, the component that
> wrote `product_key`, was deleted with the frontend. The webhook still reads
> it, so the branch is dead until the rebuild stamps it again — silently, with
> no error anywhere. Whatever replaces that button must set `product_key`.

`metadata.customer_id` is separate: see *resolveCustomer* below.

## Billing portal — `POST /api/portal`

Takes `{ customerId }`, returns a portal URL, `return_url` → `/dashboard`.
The portal's cancellation policy and product list are configured in the Stripe
Dashboard (Billing → Customer portal), **not** in code.

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
| `checkout.session.completed` | Resolve customer, write `orders` / `subscriptions`, send follow-up |
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
links the Stripe customer onto that **existing** row and activates it.

Without that link it would upsert a new row keyed only on
`stripe_customer_id` — orphaning the application row and breaking the
email-keyed profile lookup. Direct purchases (membership/concierge buttons)
carry no metadata and take the upsert path by design.

### Email failures are swallowed on purpose

`sendPurchaseFollowup` catches its own errors. A failed email must not 500 the
webhook: Stripe would retry the event, re-run fulfilment, and re-send. Non-fatal
is the correct behaviour, not an oversight.

`getSessionPriceId` is likewise best-effort and returns `null` on failure.

## Price IDs

Nine `NEXT_PUBLIC_STRIPE_PRICE_*` vars, read straight from `process.env` in
`lib/constants.ts`, `membership`, `points-concierge`, `admin/orders`, and
`admin/subscriptions`.

The admin pages build a **reverse** map (price ID → tier label) to name a
purchased tier. Any new pricing model must rebuild that mapping, not just
restyle the cards. Price IDs differ between Stripe test and live mode.

## Testing

    stripe listen --forward-to localhost:3000/api/webhooks/stripe
    stripe trigger checkout.session.completed

Test cards: `4242 4242 4242 4242` (success), `4000 0000 0000 9995` (declined).
