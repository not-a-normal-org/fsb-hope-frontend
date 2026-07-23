# Saver Miles — Website Build Docs

Read in this order:

1. [`00-context.md`](./00-context.md) — start here. Non-negotiables, current phase, open items.
2. [`01-brand-design-system.md`](./01-brand-design-system.md) — locked color tokens, typography, glass/motion spec.
3. [`02-site-structure.md`](./02-site-structure.md) — sitemap, page-by-page purpose.
4. [`03-products-and-pricing.md`](./03-products-and-pricing.md) — every product, exact pricing, copy rules. Source of truth for anything pricing-related.
5. [`04-components-spec.md`](./04-components-spec.md) — every reusable component.
6. [`05-calculator-spec.md`](./05-calculator-spec.md) — points value calculator logic (placeholder numbers, flagged).
7. [`06-integrations-tech-stack.md`](./06-integrations-tech-stack.md) — Next.js, Payload, Supabase, Stripe, Cal.com wiring plan.
8. [`07-build-plan-phases.md`](./07-build-plan-phases.md) — the actual ordered execution checklist. This is what a coding agent should work through.
9. [`08-logo-brand-mark.md`](./08-logo-brand-mark.md) — finalized logo/wordmark, export requirements.

**Living status:**
- [`TODO.md`](./TODO.md) — the active build todo, kept current. Check here first for what's done / next.
- [`spike-payload-next16.md`](./spike-payload-next16.md) — Payload-on-Next-16 spike: green light, needs a Next patch bump.

## Status

Design direction: **locked** (Blue Material Glass, dark-mode default, plus a third Mono monochrome mode — see `01-brand-design-system.md` §1–2).
Logo: **locked** (wordmark + green smile-arc underline — see `08-logo-brand-mark.md`). Full pictorial icon mark beyond the arc remains a future fast-follow, not a launch blocker.
Products: **locked**, all four products confirmed including cadence. Remaining open items: calculator valuation numbers (placeholder, needs real data), fourth stat-strip value, email provider.
Build: **in progress.** All frontend pages exist behind the construction wall; the backend track (Payload, Supabase, Stripe, Cal.com) is next. See [`TODO.md`](./TODO.md) for live status.

This plan is expected to evolve. Update files in place as decisions firm up rather than creating parallel versions.
