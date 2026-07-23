# Spike: Payload CMS on Next 16 — findings

**Question:** `docs/plans/07` flagged that Payload 3 targets Next 15.x, so before
committing to Payload for the CMS pages (Deal of the Week, `/blog`), does it work
on this repo's Next 16?

**Verdict: GREEN LIGHT.** Payload 3 supports Next 16 — we just need a patch bump.

## Evidence (npm registry, authoritative)

- **`@payloadcms/next@3.86.0` peer `next`:**
  `>=15.2.9 <15.3.0 || >=15.3.9 <15.4.0 || >=15.4.11 <15.5.0 || >=16.2.6 <17.0.0`
  → Next 16 **is** supported, specifically **16.2.6+**.
- **We are on `next@16.2.0`** — six patches short. Latest in the line is **16.2.11**.
- **Dependency resolution dry-run** of the full stack (`payload`,
  `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`,
  `graphql`) against `next@^16.2.6` + our **React 19.2.4**:
  resolved cleanly — *"added 444 packages, removed 10, changed 4"*, **no
  `ERESOLVE`/peer conflicts**.

## What this de-risks (and what it doesn't)

- **Cleared:** the headline risk — "Payload doesn't support Next 16 at all." It
  does, and the dep tree resolves with our React 19.
- **Not yet proven:** runtime integration (admin UI boots, `@payloadcms/db-postgres`
  migrates against the Supabase Postgres, collections render). That's normal
  Payload setup, a lower and more familiar risk than a hard version incompatibility.

## Prerequisite before installing Payload

**Bump `next` 16.2.0 → 16.2.11** (latest 16.2.x). This is a patch bump within the
same minor — low risk — but it must be verified against the existing app
(`tsc` + `lint` + `build` + `dev` behind the wall) as its own step. Note the repo
already carries Dependabot alerts; Payload adds ~444 packages, so re-check
`npm audit` after install.

## Implementation result (done — Payload scaffolded)

Payload **3.86** is installed and integrated. Confirmed by `next build` + `next dev`:

- **Install:** clean against Next **16.2.11** + React 19.2.4, no peer conflicts.
- **Build passes** with `withPayload`. Routes registered: `/cms/[[...segments]]`
  (admin), `/cms-api/[...slug]` + `/cms-api/graphql` + `/cms-api/graphql-playground`.
- **Custom mount paths avoid collisions.** Payload's defaults (`/admin`, `/api`)
  clash with this app's existing admin portal and API routes, so Payload is mounted
  at **`/cms`** and **`/cms-api`** (`config.routes`). Verified in dev: the existing
  `/admin` portal still returns 200, unaffected.
- **App restructured** into two root layouts via route groups — `(frontend)` (the
  marketing site, moved wholesale) and `(payload)` (Payload's own `<html>`). All
  marketing routes verified 200 in dev after the move; the construction wall still
  503s anonymous traffic.
- **DB isolation:** the Postgres adapter uses `schemaName: 'payload'`, so Payload's
  tables live in a dedicated `payload` schema, separate from the app's `public`
  tables.

### The one remaining step: `DATABASE_URI`

Payload boots but can't connect yet — `/cms` returns 500 with
`database "…" does not exist`, because **`DATABASE_URI` is empty**. This is a
**direct Postgres connection string**, a *different* credential from the Supabase
API keys (which are all that's in `.env`). Get it from **Supabase → Settings →
Database → Connection string → Session pooler**, and add it to `.env.local`:

```
DATABASE_URI=postgresql://postgres.<ref>:<db-password>@aws-0-<region>.pooler.supabase.com:6543/postgres
PAYLOAD_SECRET=<random 32-byte hex>   # already set locally
```

Once set: load `/cms`, create the first admin user, and Payload pushes the schema
into the `payload` schema. Then wire Deal of the Week, `/blog`, and the
testimonials source (a follow-up).

### Follow-ups noted

- The maintenance wall (`src/proxy.ts`) currently gates `/cms` too, so a CMS admin
  must hold the maintenance `admin_token` cookie first. Decide at launch whether to
  exempt `/cms`/`/cms-api` and let Payload's own auth be the sole gate.
- Media uploads use local disk (fine for dev); swap to a storage adapter
  (S3 / Supabase Storage) before production — serverless has no persistent disk.
- Payload adds ~444 packages; re-check `npm audit` (repo already had Dependabot alerts).
