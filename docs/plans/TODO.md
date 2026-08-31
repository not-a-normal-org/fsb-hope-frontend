# Active build todo

The living status of the build. **Keep this current** — check items off as PRs
merge, add new work here. Ordering roughly follows `07-build-plan-phases.md`;
this file is the at-a-glance "what's done / what's next."

Legend: `[x]` done (merged) · `[~]` in progress / in review · `[ ]` not started

_Last updated: 2026-08-31._

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

## Lead capture + conversion

- [x] **Lead forms** — individual + business multi-step modal → Supabase `leads` (#17, #19)
- [x] **Newsletter band** — home + footer → Supabase `newsletter_subscribers`, home-airport field (#20)
- [x] **Supabase schema committed** — `leads`, `newsletter_subscribers`; plus `customers`,
      `subscriptions`, `orders`, `products`, `admin_audit_log` DDL committed + applied (#22)
- [ ] **Stripe checkout** — products/prices in dashboard; deposit (Checkout) + success fee
      (SetupIntent/Invoice); webhooks
- [ ] **Cal.com** — business callback + `/contact` booking widget

## Accounts, roles & portals — done

- [x] **Roles + access control** on Payload `users` (admin / agent / searcher / affiliate);
      only admin reaches `/cms` or changes roles (#21)
- [x] **Team console** `/admin/team` — create / edit / suspend / reset-password (#21)
- [x] **Customer tiers** renamed to cabin classes — Economy / Premium / Business / First (#21)
- [x] **Per-account login** `/login` + session-gated `/portal` (added alongside the shared-secret
      admin gate — no lockout) (#23)
- [x] **Affiliate portal** — referral link + referred leads; first-touch `?ref` attribution (#24, #25)
- [x] **Admin Leads view** `/admin/leads` — filters + assign to a searcher/agent (`assigned_to`) (#26)
- [x] **Searcher / agent portal** — assigned-lead queue + status updates (read-isolated, write
      ownership-checked) (#27)

## Near-term — accounts / ops follow-ups

- [ ] **UI improvement pass** *(in progress)* — polish the admin console + portals
- [ ] **Notify assignee on assignment** (Resend) — email the searcher/agent when a lead lands
- [ ] **Affiliate payouts / commission** model (portal shows a placeholder today)
- [ ] **Unify admin login** onto per-account (retire the shared `ADMIN_SECRET`)
- [ ] **Customer-side referral view** once a public apply/customer flow exists

## Pre-launch gates

- [ ] **Light-mode logo variant.** The current logo (`public/savermiles-logo.png`)
      is the dark-mode artwork — it reads on light because of its dark outline,
      but a purpose-made light version is coming from Moon. When it lands:
      drop it in as `public/savermiles-logo-light.png` and make
      `src/components/site/Logo.tsx` swap on theme. The theme is `[data-theme]`
      on `<html>`, so render both `<Image>`s and toggle with CSS (no JS/flash) —
      do NOT branch on a client-side theme hook, that flashes the wrong logo on
      first paint. Regenerate the social/avatar exports for the light variant too
      if they're wanted on a light background.
- [ ] **Mark-only avatar for small sizes.** The square exports
      (`img/savermiles-avatar.png`, `img/nav_icon.png`) centre the full wordmark,
      which is unreadable once a profile picture renders at ~48px. The smiley
      mark already used for the favicon is the right art for those slots.
- [ ] **Vector logo.** There is no vector source — the lockup is custom lettering
      supplied as raster, so `img/savermiles-avatar.svg` was retired rather than
      recreated. If a vector is ever produced, it replaces the PNG set and the
      exports can be generated at any size.

- [ ] Replace calculator placeholder numbers with real search-history data
- [ ] Confirm "14+ yrs / 23,000+ searches" attribution (provenance vs. "no prior company")
- [ ] Resolve Dependabot alerts (recheck after Payload's deps)
- [ ] Remove the **SAMPLE** case study seeded in the CMS (attribution starts with `SAMPLE`)
- [ ] Configure Resend (Payload email adapter + newsletter/contact sends)
- [ ] Add prod env to Vercel (`DATABASE_URI`, `PAYLOAD_SECRET`, `S3_*`, Supabase keys)
- [ ] Rotate the DB password + S3 secret pasted during setup
- [ ] Final non-negotiables audit; then drop the construction wall + the global `noindex`

## Launch — unresolved, fix one by one (added 2026-08-31)

Go-live gate = **`MAINTENANCE_MODE=off` in Vercel Production** (the wall fails
closed). Done since the last pass: the blog build-out (7 original articles + hero
images, published) and **PR #49** (drop global `noindex` + add form consent links).
The rest is below; see the `launch-readiness` memory for detail.

### Code
- [~] Drop global `noindex` + PII-form consent links — **PR #49** (open, not merged).
- [ ] Fix 4 dead post-payment redirects (only fire once payments go live):
      `/dashboard` (`admin/applications/actions.ts`, `api/portal/route.ts`),
      `/research/intake` + `/alerts/preferences` (`api/webhooks/stripe/route.ts`).
- [ ] Blog: add the `publishedAt <= now` public filter (`blog/page.tsx` TODO), so a
      future-dated post can't show early.

### Business decisions
- [ ] Resolve **$99-vs-$25 business pricing** (homepage band implies $99 is universal;
      business search is currently flat $25, no success fee). Then unify the wording.
- [ ] Real **Privacy / Terms** copy (currently honest placeholders; forms now link to
      them at the point of collection).

### Prod data — Payload `/cms` or `/admin`
- [ ] Purge `rbactest-*` staff accounts (seeded with a published password).
- [ ] Remove the SAMPLE testimonial (id 5) + the leftover **test media** (id 3, alt
      "test"). Blog posts are already clean — only real content remains.

### Ops / Vercel
- [ ] Set `MAINTENANCE_MODE=off` (the launch switch).
- [ ] Rotate the DB password + S3 secret.
- [ ] Confirm every non-OPTIONAL `.env.example` key is set for **Production**.
      Launch-critical: `MAINTENANCE_MODE`, `PAYLOAD_SECRET`, `DATABASE_URI` (txn
      pooler :6543), `NEXT_PUBLIC_APP_URL` (prod origin, no trailing slash),
      `NEXT_PUBLIC_SUPABASE_URL` / `_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
      `S3_ACCESS_KEY_ID` / `_SECRET`, `STRIPE_SECRET_KEY` /
      `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` (+ the
      `NEXT_PUBLIC_STRIPE_PRICE_*` IDs the buy buttons read), `RESEND_API_KEY`,
      `ADMIN_EMAIL`. Deprecated / removable: `ADMIN_SECRET`. (Prod env can't be read
      from the repo — verify in the Vercel dashboard, or `vercel link && vercel env ls`.)
