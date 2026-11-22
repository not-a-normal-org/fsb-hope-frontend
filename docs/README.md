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
| [blog-guide/](blog-guide/README.md) | Blog playbook: writing rules, SEO/GEO, keyword research, cover images, publishing + verification |
| [marketing/google-ads.md](marketing/google-ads.md) | Google Ads: account setup, conversion tracking, offline uploads, the first campaign build, weekly routine |

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

Server code that survived still points at pages that no longer exist. The wall
is down and real payments run, so each row below is reachable now.

| Where | Points at | Consequence |
|---|---|---|
| `admin/applications/actions.ts` | `/dashboard?success=true&session_id=…` | **Live path.** Approve an applicant → they pay via Stripe payment link → land on a dead URL |

It is a live path: any signed-in admin can approve an applicant, and the
customer then pays and lands on a 404.

This URL was left as-is deliberately. It is the specification for what the
rebuild owes: a post-purchase page that resolves a Stripe session. Redirect
targets are a product decision, so they are recorded here rather than guessed
at.

The profile step that page was to host had two API routes, `POST /api/profile`
and `GET /api/profile/lookup`. Both were removed on 2026-11-22, unused: anyone
holding a checkout session id could read that buyer's name, phone and company,
or overwrite them, and session ids sit in success-page URLs that analytics
record. A rebuilt `/dashboard` needs its own proof of identity, such as a
signed, short-lived link, not a bare session id.

`session.metadata.product_key` is stamped by the alert checkout
(`AlertBuyBox` → `CheckoutButton`) but no longer read: the webhook's onboarding
emails went with the retired Research Report and Seat Alert products. See
[external-apis/stripe.md](external-apis/stripe.md).

## Reading order for the rebuild

1. [external-apis/README.md](external-apis/README.md) — what must survive, in one page.
2. [external-apis/stripe.md](external-apis/stripe.md) — the highest-risk integration; live money.
3. [maintenance-mode.md](maintenance-mode.md) — how to take the site public again.
