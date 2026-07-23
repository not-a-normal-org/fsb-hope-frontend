# Docs

Reference material that outlives the frontend rebuild.

The v1 frontend is being rebuilt from scratch. The pages are disposable; the
integrations below are not — they are contracts with systems we do not control
(Stripe's dashboard config, Supabase's tables, Resend's verified domain), and
they keep running whether or not any page renders.

| Doc | What it covers |
|---|---|
| [external-apis/](external-apis/README.md) | Stripe, Supabase, Resend, Cal.com — keys, call sites, gotchas |
| [maintenance-mode.md](maintenance-mode.md) | The temporary wall on the site, and how to remove it |

The old code itself is archived at [`archive/frontend-v1/`](../archive/frontend-v1/ARCHIVE.md)
and at the git tag `archive/frontend-v1`.

## Current state

Every marketing and customer-facing page has been deleted. What remains:

    src/app/api/**        14 route handlers (Stripe, Supabase, Resend)
    src/app/admin/**      the admin portal + 4 server actions
    src/app/maintenance/  the under-construction notice
    src/app/page.tsx      placeholder home (admin-only; public sees the notice)
    src/lib/              stripe, supabase/*, constants (site name/url), maintenance
    src/proxy.ts          construction wall + admin gate

Deleted: all 16 public pages, `src/components/**`, `lib/animations.ts`,
`lib/types.ts`, and the 940-line `lib/constants.ts` (now 5 lines of site
metadata). The admin portal was untouched — it imports only
`@/lib/supabase/admin` and `@/lib/stripe`, nothing from the deleted tree.

## Dangling references — read before launch

Server code that survived still points at pages that no longer exist. None of
it is reachable today (the wall 503s the public), so nothing is broken *now* —
but each one is a live landmine at launch.

| Where | Points at | Consequence |
|---|---|---|
| `admin/applications/actions.ts` | `/dashboard?success=true&session_id=…` | **Live path.** Approve an applicant → they pay via Stripe payment link → land on a dead URL |
| `api/checkout` `success_url` | `/dashboard?success=true&session_id=…` | Paid customer lands on a dead URL |
| `api/checkout` `cancel_url` | `/membership` | Abandoned checkout lands on a dead URL |
| `api/portal` `return_url` | `/dashboard` | Exiting the billing portal lands on a dead URL |
| `api/webhooks/stripe` | `/research/intake?session=…` | Onboarding email links nowhere |
| `api/webhooks/stripe` | `/alerts/preferences?session=…` | Onboarding email links nowhere |

The admin one is the sharpest: that flow is reachable *right now* by any signed-in
admin, and the customer paying is anonymous — so they hit the construction
notice (503), not even a 404, after being charged.

These URLs were left as-is deliberately. They are the specification for what
the rebuild owes: a post-purchase page that resolves a Stripe session, a
pricing/cancel target, and two intake forms. Redirect targets are a product
decision, so they are recorded here rather than guessed at.

Also orphaned: `session.metadata.product_key` is still **read** by the webhook
to pick an onboarding email, but the component that **wrote** it
(`CheckoutButton`) is deleted. Until the rebuild stamps it again, that branch
never fires — silently. See [external-apis/stripe.md](external-apis/stripe.md).

## Reading order for the rebuild

1. [external-apis/README.md](external-apis/README.md) — what must survive, in one page.
2. [external-apis/stripe.md](external-apis/stripe.md) — the highest-risk integration; live money.
3. [maintenance-mode.md](maintenance-mode.md) — how to take the site public again.
