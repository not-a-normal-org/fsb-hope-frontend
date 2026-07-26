# Active build todo

The living status of the build. **Keep this current** — check items off as PRs
merge, add new work here. Ordering roughly follows `07-build-plan-phases.md`;
this file is the at-a-glance "what's done / what's next."

Legend: `[x]` done (merged) · `[~]` in progress / in review · `[ ]` not started

_Last updated: 2026-07-26._

## Foundation — done

- [x] Three-mode Blue Glass design system (tokens, GlassPanel, AmbientBackground, ShineText, ModeToggle), flash-free theming
- [x] Construction wall (`src/proxy.ts`) — admin-gated; public sees `/maintenance`
- [x] Logo (wordmark + green arc), fonts (Zilla Slab / IBM Plex)
- [x] PR-per-feature git workflow (`AGENTS.md`)
- [x] Custom cursor (dot + spring ring, accent glow, hover grow) — theme-aware, fine-pointer only
- [x] Button hover system — filled `.sm-cta` (shine sweep) + outline `.sm-cta-ghost` (border/wash/sweep)

## Pages — done (frontend)

- [x] `/` home — hero, audience fork, ghost-vs-real, alerts teaser, calculator teaser, proof teaser
- [x] `/individual`, `/business` — audience pages (lead form still deferred — see below)
- [x] `/pricing`, `/alerts` — the four products + phantom disclosure
- [x] `/how-it-works` — 3-step explainer
- [x] `/about` — mission + mechanism + transparent pricing
- [x] `/calculator` — points-value estimate (placeholder numbers, flagged)
- [x] `/contact` — email route (booking/form deferred)
- [x] `/legal/privacy`, `/legal/terms` — honest placeholders

## Backend / CMS — done

- [x] **Payload CMS on Next 16** (`spike-payload-next16.md`) — admin `/cms`, API `/cms-api`,
      Postgres on the SaverMiles Supabase project (`payload` schema, session pooler)
- [x] Collections: `posts`, `categories`, `deals-of-week`, `testimonials` (Case Studies)
- [x] `/blog` + `/blog/[slug]` — searchable card grid, category pages, Guides/Deals nav
- [x] Media → Supabase Storage (S3), per-post SEO (meta tab, OG images), drafts
- [x] **Case-study section** — `/results` wall + `/results/[slug]` detail + home proof teaser,
      driven by the `testimonials` collection (consent-gated; no fabrication)

## Next: lead capture + conversion — not started

- [ ] **Lead forms** *(next up)* — individual + business multi-step → Supabase, replacing the
      interim `mailto:` CTAs on `/individual`, `/business`, `/contact`. Kept API routes from the
      prior build (`/api/contact`, `/api/apply`, `/api/newsletter`) + the admin portal are the
      backend to wire into. Confirm/extend the Supabase schema as needed.
- [ ] **Supabase schema** — `leads`, `newsletter_subscribers`, `alert_subscriptions`,
      `search_requests` (`docs/plans/06`) — reconcile with what the kept API routes already use.
- [ ] **Newsletter band** — home + footer → Supabase/Resend (Resend not yet configured)
- [ ] **Stripe checkout** — products/prices in dashboard; deposit (Checkout) + success fee
      (SetupIntent/Invoice); webhooks
- [ ] **Cal.com** — business callback + `/contact` booking widget

## Pre-launch gates

- [ ] Replace calculator placeholder numbers with real search-history data
- [ ] Confirm "14+ yrs / 23,000+ searches" attribution (provenance vs. "no prior company")
- [ ] Resolve Dependabot alerts (recheck after Payload's deps)
- [ ] Remove the **SAMPLE** case study seeded in the CMS (attribution starts with `SAMPLE`)
- [ ] Configure Resend (Payload email adapter + newsletter/contact sends)
- [ ] Add prod env to Vercel (`DATABASE_URI`, `PAYLOAD_SECRET`, `S3_*`, Supabase keys)
- [ ] Rotate the DB password + S3 secret pasted during setup
- [ ] Final non-negotiables audit; then drop the construction wall + the global `noindex`
