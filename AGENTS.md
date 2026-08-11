<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Saver Miles — agent guide

A prelaunch lead-generation site for a manual, human-run points-and-miles
concierge. **The build spec lives in [`docs/plans/`](docs/plans/README.md) — read
it first; it is the source of truth.** This file is how to work in the repo.

## Stack

- **Next.js 16** (App Router), React 19, TypeScript. Middleware is `proxy.ts`, not
  `middleware.ts` — see `src/proxy.ts`. Reading `cookies()` in a layout/page makes
  that route dynamic; avoid it unless intended.
- **Tailwind v4** — CSS-first. Tokens live in `src/app/globals.css` (`@theme inline`
  + `--sm-*` custom properties), not in a JS color map. `tailwind.config.ts` only
  carries fonts + the type scale.
- **Framer Motion** for animation, **next/font** for fonts (Zilla Slab / IBM Plex
  Sans / IBM Plex Mono), **Lucide** for icons.
- **Stripe, Supabase, Resend** — live integration layer, kept from the prior build.
  Reference: [`docs/external-apis/`](docs/external-apis/README.md).

## Where things live

| Path | What |
|---|---|
| `src/app/` | Routes (App Router). `page.tsx` is the home page. |
| `src/components/system/` | Design-system primitives: `GlassPanel`, `AmbientBackground`, `ShineText`, `ModeToggle`, `ThemeScript`. |
| `src/components/site/` | Marketing components: `NavBar`, `Footer`, `Logo`, `HomeHero`, `AudienceFork`, etc. |
| `src/lib/` | `stripe.ts`, `supabase/*`, `maintenance.ts` (the wall's flag/helpers), `animations.ts` (motion tokens), `constants.ts` (site name/url). |
| `src/proxy.ts` | The construction wall + admin auth gate. |
| `src/app/admin/`, `src/app/api/` | Admin portal + API routes (Stripe/Supabase/Resend). Kept from the prior build — leave untouched unless the task is about them. |
| `docs/plans/` | The build spec (design system, products, pages, phases). Source of truth. |
| `archive/frontend-v1/` | Snapshot of the original frontend. Reference only; never import from it. |

## Design-system rules

- **Never hardcode hex in components.** Read tokens: `bg-bg-base`, `text-ink`,
  `text-ink-sub`, `text-accent`, `bg-cta`, `text-cta-text`, `border-accent`, or raw
  `var(--sm-*)` for glass/blob/gradient. The **only** exception is the logo arc's
  fixed green `#0E7C50` (see `docs/plans/08-logo-brand-mark.md`).
- **Three theme modes: dark (default), light, mono.** Each reassigns the *same*
  canonical `--sm-*` names under `[data-theme=...]`. Never introduce a
  mode-specific name (e.g. `--sm-mono-cta`) that a component reads — Mono would
  silently fall back to blue. Any color change must be checked in all three modes;
  confirm no blue leaks into Mono.
- **Respect `prefers-reduced-motion` everywhere** — `MotionProvider` (framer-motion
  `MotionConfig reducedMotion="user"`) + the CSS media query in `globals.css` cover
  it. Don't add motion that bypasses them.
- Motion timings/easings come from `src/lib/animations.ts` — reuse them, don't
  hand-write durations.

### Contrast & controls (checked in all three modes)

- **Contrast is non-negotiable in every mode.** `--sm-ink-muted` is the lightest
  ink and is tuned per theme — don't assume a token that reads fine in Dark also
  reads in Light/Mono. Body/label/placeholder text must stay legible on the
  surface it sits on (aim ~4.5:1). If a token looks too light on a light surface,
  fix the token *for that theme*, not with a one-off hex.
- **Buttons:** filled primary → `.sm-cta`; secondary/outline → `.sm-cta-ghost`;
  circular icon buttons (modal close, dismiss) → `.sm-icon-btn` (never a bare
  ghost on an elevated surface — it disappears). Set background/border via these
  classes, not inline styles, so `:hover` can take effect.
- **Disabled** controls use `disabled:opacity-55` (not lower — 45% reads as dead
  gray), plus `disabled:cursor-not-allowed`.
- **Overlays/modals** sit on `--sm-bg-elevated`; the close control must be
  clearly visible (`.sm-icon-btn`). Always eyeball a new overlay/form in **Light
  and Mono**, not just Dark — most contrast bugs only show in Light.

## The construction wall

The whole site is gated by `src/proxy.ts`: anonymous visitors get a **503 rewrite
to `/maintenance`**; only a signed-in staff member sees real pages. The Stripe
webhook (`/api/webhooks/stripe`) is exempt. See [`docs/maintenance-mode.md`](docs/maintenance-mode.md).

**Auth is per-user Payload sessions with roles** (admin/agent/searcher/affiliate),
not a shared secret. Sign in at `/admin/login` with a staff account (created in
`/admin/team` or seeded via `npm run seed:staff`). One `payload-token` session
governs `/admin` (roles decide which sections — see `src/lib/access.ts`), the
`/cms` panel, and lifting the wall. The edge middleware verifies that JWT with
`jose` (`src/lib/session-edge.ts`); the authoritative role check is `payload.auth`
in the `/admin` layout (`src/lib/auth.ts`). `MAINTENANCE_MODE=off` drops the wall
entirely for local work. The wall comes down at launch.

## Product non-negotiables (from `docs/plans/00-context.md`)

- **No founder names, no Upwork, no prior company name** anywhere public-facing.
- **Don't advertise products that don't exist yet.** (AI evaluation is a documented
  *post-launch* product — not built, not mentioned in launch copy.)
- **Manual/human search is the differentiator** — "a real person checked this," not
  "an algorithm found it."
- **No fabricated social proof** (customer counts, dollar totals, review counts).

## Secrets

Never commit `.env` / `.env.local` or any key — they are gitignored, keep them so.
`NEXT_PUBLIC_*` values are compiled into the browser bundle; never move a secret
behind that prefix.

## Git & PR workflow

- **One ticket / feature / product per branch, per PR, per issue.** Never bundle
  unrelated work into a single PR — a page, a fix, and a doc change are three PRs.
- **When a task is done and verified, commit it and open a PR** — don't leave
  finished work sitting on a local branch. Branch off `main`:
  `feat/…`, `fix/…`, `docs/…`, `chore/…`; push; `gh pr create`.
- **Before starting a new module, check open PRs** (`gh pr list`) and know their
  status. Don't pile new work on top of unreviewed branches without a reason.
- **Don't merge your own PR unless asked** — leave it for the user to review.
- **Small, logical commits within a PR.** The body explains *why*, not what the
  diff already shows — the reasoning, the constraint, the gotcha avoided.
- **Conventional-commit subjects**, imperative mood, ≤ ~72 chars:
  `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`, `perf:`.
- **Never commit secrets**, `.next/`, or `node_modules/`.
- End AI-authored commits with:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`

## Testing / verification rules

There is no unit-test framework yet. Verification is **tsc + lint + build + dev +
manual**, and all of it is expected before calling a change done:

1. `npx tsc --noEmit` — clean.
2. `npx eslint src` — clean.
3. `npx next build` — succeeds.
4. **`npx next dev` and actually load the affected pages.** This is not optional:
   **`next build` has masked errors that only `next dev` surfaces** (e.g. a CSS
   comment that built fine but broke dev's parser). Trust dev, not just build.
5. **Verify behind the wall.** Sign in as admin, load `/`, `/maintenance`, and any
   affected route; confirm no 500s and no CSS/console errors. The admin password is
   in `.env.local`.
6. **Theme changes:** exercise all three modes (Light / Dark / Mono); confirm the
   crossfade works and no blue leaks into Mono.
7. **Reduced-motion:** confirm animations degrade when the OS setting is on.

**No browser driver is available in this environment** — pixel-level / visual
correctness can't be screenshot-verified here and needs a human's eyes. Verify
structure/HTML/compiled-CSS programmatically and say plainly when a visual check is
the user's to make.

Always kill stray dev servers you started. Use unique ports to avoid clashing with
the user's own `npm run dev`.
