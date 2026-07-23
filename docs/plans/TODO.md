# Active build todo

The living status of the build. **Keep this current** — check items off as PRs
merge, add new work here. Ordering roughly follows `07-build-plan-phases.md`;
this file is the at-a-glance "what's done / what's next."

Legend: `[x]` done (merged) · `[~]` in progress / in review · `[ ]` not started

_Last updated: 2026-07-23._

## Foundation — done

- [x] Three-mode Blue Glass design system (tokens, GlassPanel, AmbientBackground, ShineText, ModeToggle), flash-free theming
- [x] Construction wall (`src/proxy.ts`) — admin-gated; public sees `/maintenance`
- [x] Logo (wordmark + green arc), fonts (Zilla Slab / IBM Plex)
- [x] PR-per-feature git workflow (`AGENTS.md`)

## Pages — done (frontend)

- [x] `/` home — hero, audience fork, ghost-vs-real, alerts teaser, calculator teaser
- [x] `/individual`, `/business` — audience pages (lead form deferred)
- [x] `/pricing`, `/alerts` — the four products + phantom disclosure
- [x] `/how-it-works` — 3-step explainer
- [x] `/about` — mission + mechanism + transparent pricing
- [x] `/calculator` — points-value estimate (placeholder numbers, flagged)
- [x] `/results` — coming-soon state (no fabricated testimonials)
- [x] `/contact` — email route (booking/form deferred)
- [x] `/legal/privacy`, `/legal/terms` — honest placeholders

## Next: case study section (NEW — requested)

- [ ] **Case study section.** A real proof/case-study surface — likely a home
      section that teases one study + the full wall on `/results` (currently
      coming-soon). Depends on real, permission-cleared client stories; the data
      source is the Payload `testimonials`/case-study collection (see below), so
      it lands with or after the Payload work. **Do not fabricate** — ships from
      real stories only (`docs/plans/00`).

## Backend track — not started (needs external setup)

- [~] **Payload CMS on Next 16** — spike done, GREEN LIGHT
      (see `spike-payload-next16.md`). Prerequisite: bump Next 16.2.0 → 16.2.11.
  - [ ] `chore:` bump Next to 16.2.11, verify existing site unaffected
  - [ ] Install Payload + `@payloadcms/db-postgres` → same Supabase Postgres
  - [ ] Collections: `posts`, `categories`, `deals-of-week`, `testimonials`
  - [ ] Deal of the Week (home) · `/blog` + `/blog/[slug]` · case-study source
- [ ] **Supabase schema** — `leads`, `newsletter_subscribers`, `alert_subscriptions`, `search_requests` (`docs/plans/06`)
- [ ] **Lead forms** — individual + business multi-step → Supabase (replaces interim `mailto:` CTAs)
- [ ] **Newsletter band** — home + footer → Supabase/Resend
- [ ] **Stripe checkout** — products/prices in dashboard; deposit (Checkout) + success fee (SetupIntent/Invoice); webhooks
- [ ] **Cal.com** — business callback + `/contact` booking widget

## Pre-launch gates

- [ ] Replace calculator placeholder numbers with real search-history data
- [ ] Confirm "14+ yrs / 23,000+ searches" attribution (provenance vs. "no prior company")
- [ ] Resolve Dependabot alerts (29 flagged; recheck after Payload's ~444 deps)
- [ ] Final non-negotiables audit; then drop the construction wall
