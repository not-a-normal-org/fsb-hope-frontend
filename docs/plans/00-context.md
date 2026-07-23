# Saver Miles — Build Context

Read this file first. Every other file in this folder assumes the rules here.

## What this is

Saver Miles is a travel booking and points-and-miles concierge service. We manually search 30+ airline loyalty programs to find real, bookable award seats — not the ghost availability that automated search tools show. We deliver proof (screenshots, exact point cost) instead of guesses.

The business operates from Bangladesh, targeting US-based clients. It is built entirely from scratch: new brand, new code, new content. No ties to any prior business, brand, or partner.

## Who buys this

Two buyer types, both served from one brand:

1. **Individuals** — people sitting on credit card or airline points who don't know how to find bookable award seats. Emotionally driven by "I earned these, I want to actually use them for something great."
2. **Businesses** — high-revenue US business owners and their finance/ops people who spend heavily on business travel and want to convert that spend into points-funded premium travel. Rationally driven by cost savings and account-level reliability.

Referral channel in development: US accountants and bookkeepers who refer their business-owner clients.

## Non-negotiables (do not violate these, ever)

- **No founder names anywhere in external-facing content.** Not in copy, not in schema `author` fields exposed publicly, not in metadata, not in the CMS-rendered output. Internal admin fields are fine, but nothing public-facing.
- **No mention of Upwork**, founder work history, or prior platforms/ranking anywhere in external-facing content. If existing copy or components reference Upwork, remove it.
- **No mention of any prior company name** (this business has had prior names internally; none of them ever appear publicly).
- **Do not advertise products that don't exist yet.** Only build and publish pages for products that are actually defined in `03-products-and-pricing.md`. A "membership" or "earning-strategy audit" page does not exist until that product is actually scoped — do not create placeholder pages for it.
- **Manual search is the core differentiator.** Every product description, every trust section, should reinforce "a real person checked this," not "an algorithm found this."

## Brand tone

Precise, competent, quietly premium. Not flashy-travel-influencer. Not cheap-SaaS-tool. Think: a private banking product page crossed with a high-end travel concierge. Confident, short sentences, no filler adjectives, no hype words ("game-changing," "revolutionary," "unlock").

## Current build phase

This is a **prelaunch lead-generation site**, not a full transactional platform yet. Payment infrastructure (Stripe) and database (Supabase) are being wired in during this build, but the primary goal right now is:

1. Look premium and alive (glass/motion design system, see `01-brand-design-system.md`)
2. Capture leads (individual + business flows, alert signups, newsletter)
3. Present real products clearly (see `03-products-and-pricing.md`)
4. Be ready to flip on live payment collection once Stripe config is finished

## File index

- `00-context.md` — this file
- `01-brand-design-system.md` — locked color system, typography, glass/motion spec
- `02-site-structure.md` — sitemap and page purposes
- `03-products-and-pricing.md` — every product, exact pricing, exact copy rules
- `04-components-spec.md` — every reusable component, what it does, what state it holds
- `05-calculator-spec.md` — points-to-value calculator logic
- `06-integrations-tech-stack.md` — Next.js, Payload, Supabase, Stripe, Cal.com, Framer Motion wiring plan
- `07-build-plan-phases.md` — ordered build steps, this is what the coding agent should execute against, in order
- `08-logo-brand-mark.md` — finalized logo/wordmark construction, the one deliberate green exception, export requirements

## Repo state (this is NOT a greenfield build)

The site already exists as a Next.js 16 App Router project — Tailwind v4,
Framer Motion, Stripe, Supabase, and Resend are installed and partly wired, and
there is a live admin portal plus 14 API routes from an earlier iteration. Build
phase 0 ("scaffold") is effectively done. The decision is **keep & extend** the
existing Stripe/Supabase/Resend integration layer and admin, adding the new
schema and flows alongside — not replace them. See `07-build-plan-phases.md`.

The whole new site is being built **behind a construction wall** (`src/proxy.ts`):
anonymous visitors get a 503 `/maintenance` notice; only a signed-in admin sees
real pages. The wall comes down at launch (Phase 9).

## Products roadmap note — AI is post-launch

An AI-assisted evaluation product (tool search + AI read of a points balance)
is a **future product, after launch**. The AI pipeline and its API do not exist
yet, so per the non-negotiable "do not advertise products that don't exist," it
is **not built and not mentioned** in any launch copy. The launch positioning is
manual/human search. Add AI to `03-products-and-pricing.md` as a roadmap item
only.

## Open items not yet finalized (do not guess, ask before building)

- Real point-valuation numbers for the calculator (`05-calculator-spec.md`) are placeholder/illustrative. Do not launch the calculator with unverified numbers — a wrong estimate undermines the "we deal in real numbers, not guesses" brand promise. Real search history (23,000+ completed searches) is a better source than generic published averages and should replace the placeholder table before launch.
- The fourth stat in `<StatStrip />` (`04-components-spec.md`) has no confirmed value. It previously held an Upwork-ranking stat, which is now banned. **Resolved for now:** `StatStrip` ships with **3 real stats** (14+ yrs / 23,000+ searches / 30+ programs) and no fourth slot until a verifiable value exists.
- **Provenance of the experience stats:** "14+ yrs / 23,000+ searches" implies a track record predating this "from-scratch, no prior company" brand whose founders can't be named publicly. Usable behind the wall now; **confirm the wording/attribution before the wall comes down.**
- Email service provider: **Resolved — Resend.** It is already the live provider across the API routes, sending from `hello@savermiles.com`. `savermiles.com` must stay verified in Resend (SPF/DKIM) before public launch.
- Logo/wordmark: **finalized**, see `08-logo-brand-mark.md`. Remaining open question is only whether a fuller pictorial icon mark (beyond the arc) gets designed later — not blocking launch.
