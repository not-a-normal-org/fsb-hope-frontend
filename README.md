# Saver Miles

Prelaunch lead-generation site for a manual, human-run points-and-miles
concierge. Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 ·
Payload CMS · Supabase · Stripe · Resend.

## Working in this repo

- **Agent/contributor guide:** [`AGENTS.md`](AGENTS.md) — architecture, the
  design-system + theme rules, the construction wall, product non-negotiables,
  and the commit/testing rules.
- **Build spec (source of truth):** [`docs/plans/`](docs/plans/README.md).

## Local development

Requires **Node 22** (see `.nvmrc`).

```bash
nvm use            # Node 22
npm install
cp .env.example .env.local   # then fill in real values
npm run dev        # http://localhost:3000
```

The site is gated by a construction wall. To view real pages locally either sign
in at `/admin/login` (password = `ADMIN_SECRET`) or set `MAINTENANCE_MODE=off` in
`.env.local`. See [`docs/maintenance-mode.md`](docs/maintenance-mode.md).

## Verify before shipping

```bash
npx tsc --noEmit      # types
npx eslint src        # lint
npx next build        # production build
npx next dev          # and actually load the affected pages
```

## Deploy

Hosted on Vercel. See [`docs/deployment.md`](docs/deployment.md) for the required
environment variables, the pooled `DATABASE_URI`, the Stripe webhook, and the
launch step (`MAINTENANCE_MODE=off`). All environment keys are documented in
[`.env.example`](.env.example).
