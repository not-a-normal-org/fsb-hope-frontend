# Build Plan — Ordered Phases

This is the execution checklist. Work top to bottom. Do not start a phase until the previous one's checklist is done. If a step references an "open item" from `00-context.md`, stop and flag it rather than guessing.

## NOT greenfield — start from the existing repo

This project already exists. Do **not** scaffold from zero. Already in place:
Next.js **16** App Router, Tailwind **v4**, Framer Motion, Stripe, Supabase, and
Resend (live), plus an admin portal and 14 API routes. Decision: **keep & extend**
that backend, don't replace it. The whole build happens **behind the construction
wall** (`src/proxy.ts`) until Phase 9.

**Risks to clear before the phases that hit them:**
- **Payload 3 targets Next 15.x.** This repo is Next 16 — verify Payload/Next-16
  compatibility *before* scaffolding Payload (Phase 0), and confirm its
  migrations won't collide with the existing app tables in the shared Postgres.
- **Individual Search success fee** is a deferred charge (SetupIntent or Invoice),
  not hosted Checkout — see `06-integrations-tech-stack.md`. Only the $25 deposit
  is plain Checkout.

**Already done** (first slice, done): the three-mode design system (tokens,
GlassPanel, AmbientBackground, ShineText, ModeToggle), fonts, flash-free theming,
and the Home page (hero + audience fork + ghost-vs-real) with `/individual` and
`/business` skeletons — all behind the wall.

## Phase 0 — Setup

- [x] ~~Scaffold Next.js~~ — already exists (Next 16 App Router)
- [x] ~~Tailwind + design tokens~~ — done in the first slice (Tailwind v4, `@theme inline` + `--sm-*` tokens for all three modes)
- [x] ~~Install Framer Motion~~ — present
- [ ] Set up Supabase schema from `06-integrations-tech-stack.md` (leads, newsletter_subscribers, alert_subscriptions, search_requests) — **alongside** the existing tables
- [ ] Install/configure Payload CMS — **first verify Next 16 compatibility** — point its adapter at the same Supabase Postgres (namespace-checked)
- [ ] Create Payload collections: posts, categories, deals-of-week, testimonials
- [ ] Confirm Stripe account keys are available in environment (test mode first)
- [ ] Confirm Cal.com account exists, create the "Saver Miles intro call" booking type manually in the Cal.com dashboard (not a code task)
- [x] ~~Confirm email provider~~ — **Resend**, already live (`hello@savermiles.com`)

## Phase 1 — Design system implementation

- [ ] Build `<AmbientBackground />` component (light + dark blob variants)
- [ ] Build `<GlassPanel />` component
- [ ] Build `<ShineText />` component with the shine-sweep animation
- [ ] Build `<ModeToggle />` as a 3-way control (Light / Dark / Mono) with crossfade transition — confirm every token consumer has a Mono value, not just Light/Dark, before marking this done
- [ ] Build global typography scale (Zilla Slab / IBM Plex Sans / IBM Plex Mono) as Tailwind text style utilities or a typography component set
- [ ] Verify `prefers-reduced-motion` handling across all of the above
- [ ] Build a single internal style-check page (not public-facing) that renders every component in both light and dark, for visual QA as the build continues

## Phase 2 — Layout & navigation

- [ ] Build `<NavBar />` (sticky, blur-on-scroll, mode toggle, primary CTA)
- [ ] Build `<Footer />` (sitemap links, newsletter band, legal links)
- [ ] Wire up routing for all pages in `02-site-structure.md` as empty/skeleton pages first, so the full sitemap exists and is navigable before content is filled in

## Phase 3 — Core marketing components

- [ ] `<StatStrip />` — confirm no Upwork/ranking stat is present
- [ ] `<GhostVsRealCompare />`
- [ ] `<AudienceFork />`
- [ ] `<DealOfTheWeek />` — wire to Payload `deals-of-week` collection, build the empty/no-active-deal state too
- [ ] `<AlertProductCard />` — both variants, with inline phantom-flight disclosure per `03-products-and-pricing.md`
- [ ] `<NewsletterBand />` — writes to `newsletter_subscribers`
- [ ] `<TestimonialCard />` — including empty state for pre-launch

## Phase 4 — Calculator

- [ ] Build `<PointsCalculator variant="compact|full" />` per `05-calculator-spec.md`
- [ ] Implement with the placeholder valuation/threshold tables, clearly marked in code comments as placeholder
- [ ] **Do not remove the "estimates only" disclaimer or ship without it**
- [ ] Build the shareable-link/social-card behavior for the full `/calculator` page
- [ ] Flag for Moon/Tanzil: real valuation numbers need confirmation before this goes live to real traffic

## Phase 5 — Lead capture flows

- [ ] Rebuild `<LeadFlowIndividual />` inside the new glass system, preserving existing validation logic and copy
- [ ] Rebuild `<LeadFlowBusiness />` inside the new glass system
- [ ] Integrate Cal.com embed into the final step of `<LeadFlowBusiness />`
- [ ] Build `<ContactForm />`
- [ ] Connect all lead-capturing components to Supabase (`leads` table), remove any window.storage/localStorage usage carried over from the prelaunch prototype — this is production now

## Phase 6 — Payments

- [ ] Create Stripe Products/Prices per the table in `06-integrations-tech-stack.md` (Human Search Alert cadence is confirmed monthly — safe to create)
- [ ] Implement Stripe Checkout sessions for: Business Search, Individual Search deposit, Weekly Lookup Alert subscription
- [ ] Implement webhook handler: `checkout.session.completed`, `customer.subscription.deleted`, `charge.refunded`
- [ ] Implement the Individual Search success-fee charge flow (triggered manually by ops once a booking is confirmed, not an automatic checkout)
- [ ] Test full payment flows in Stripe test mode before going live

## Phase 7 — Pages

Build in this order, since later pages reuse components built for earlier ones:

- [ ] `/pricing` (uses AlertProductCard, pricing data — good early integration test of Phase 3+6 components)
- [ ] `/how-it-works`
- [ ] `/` Home (uses almost every Phase 3 component — build last among the "easy" pages so components are already proven)
- [ ] `/individual`
- [ ] `/business`
- [ ] `/alerts`
- [ ] `/calculator`
- [ ] `/about`
- [ ] `/results`
- [ ] `/contact`
- [ ] `/blog` + `/blog/[slug]`
- [ ] `/legal/privacy`, `/legal/terms`

## Phase 8 — QA pass

- [ ] Full-site check across all three modes (Light / Dark / Mono) — every page, every component. Specifically check for any component that falls back to blue tokens when Mono is active (a sign it wasn't wired to the Mono token set)
- [ ] Full-site copy audit: search for "Upwork," founder names, or prior company names — zero results required
- [ ] Mobile responsive pass on all pages
- [ ] Keyboard-navigation pass on nav, mode toggle, both lead flows, calculator, forms
- [ ] Reduced-motion pass
- [ ] Stripe test-mode end-to-end run for each of the three Phase-6 checkout flows
- [ ] Cal.com booking end-to-end test from `/business` and `/contact`
- [ ] Newsletter signup end-to-end test, confirm email delivery (once provider is confirmed)

## Phase 9 — Launch prep

- [ ] Flip Stripe from test mode to live mode
- [ ] Confirm domain DNS pointed at hosting
- [ ] Final review against `00-context.md` non-negotiables list
- [ ] Go live

---

**Note for whoever runs this plan:** this document is expected to change as the build progresses — treat it as a living checklist, not a frozen spec. Update it in place as decisions get made (especially the flagged open items), rather than creating a second competing plan document.
