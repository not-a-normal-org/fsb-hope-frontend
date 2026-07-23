# Resend

Transactional and onboarding email.

- SDK: `resend` v6
- Key: `RESEND_API_KEY`
- Sender: `SaverMiles <hello@savermiles.com>` (every call site)
- Internal recipient: `ADMIN_EMAIL`, defaulting to `admin@savermiles.com`

## The placeholder fallback is a feature

Every send site checks:

```ts
if (!apiKey || apiKey === 'your_resend_key') { /* skip, return success */ }
```

Missing or placeholder key → the send is skipped and the route still returns
success. Local dev and tests run the full signup/contact/apply flows without
credentials.

Keep this in the rebuild. Removing it makes every form fail on a fresh clone.
The tradeoff is real, though: **a misconfigured production deploy silently
sends nothing** and looks perfectly healthy. Worth a startup warning when
`NODE_ENV === 'production'` and the key is absent.

## Client construction is inconsistent

| Pattern | Where |
|---|---|
| Module-level `new Resend(process.env.RESEND_API_KEY)` | `/api/apply` |
| Per-request `new Resend(apiKey)` after the guard | everywhere else |

`/api/apply` constructs at module load and so **skips the placeholder guard**
that the other routes apply. Worth unifying during the rebuild — a single
`sendEmail()` helper wrapping the guard would replace the copy-pasted check in
six files.

## Send sites

| Route / action | Emails sent |
|---|---|
| `POST /api/apply` | Applicant confirmation + admin notification |
| `POST /api/contact` | Sender confirmation + admin notification |
| `POST /api/newsletter` | Welcome |
| `POST /api/alerts-preferences` | User confirmation + admin notification |
| `POST /api/research-intake` | User confirmation + admin notification |
| `POST /api/webhooks/stripe` | Purchase follow-up (see below) |
| `admin/applications/actions.ts` | Approval / rejection |

The pattern is consistent: one email to the customer, one to `ADMIN_EMAIL`.

## Webhook follow-ups

`sendResend()` in the webhook is fire-and-forget and no-ops when unconfigured
or when `to` is null. `sendPurchaseFollowup()` branches on
`session.metadata.product_key`:

| `product_key` | Email |
|---|---|
| `research` | Intake link → `/research/intake?session=…` |
| `alerts_essential` / `alerts_pro` (prefix `alerts_`) | Routes link → `/alerts/preferences?session=…` |
| `concierge` | None |

Both emails link back to `NEXT_PUBLIC_APP_URL`. If that var is wrong in
production, customers receive mail pointing at a dead host.

The whole function is wrapped in try/catch and swallows failures **by design**:
a throw would 500 the webhook, and Stripe would retry the event and re-run
fulfilment, duplicating emails and rows. Do not "fix" this by letting it
propagate. See [stripe.md](stripe.md#email-failures-are-swallowed-on-purpose).

## Deliverability

`savermiles.com` must stay verified in the Resend dashboard, with SPF/DKIM DNS
records intact. Domain verification is external state: it can lapse without a
single code change, and the first symptom is silent non-delivery.
