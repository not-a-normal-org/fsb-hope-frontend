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

### CONFIRMED WORKING against Supabase (new SaverMiles project)

Booted `/cms` against the new Supabase project — it connected, pushed its schema,
and served the "create first user" page (200). Verified in the DB: the `payload`
schema holds all 13 Payload tables (`posts`, `categories`, `deals_of_week`,
`testimonials`, `media`, `users`, + Payload internals); **`public` is untouched
(0 tables)** — the `schemaName: 'payload'` isolation works.

**Use the Session pooler, NOT the direct connection.** The dashboard's default
"Direct connection" (`db.<ref>.supabase.co:5432`) is **IPv6-only** — node/pg
returns `ENOTFOUND`, and Vercel is IPv4, so it fails in both. The Session pooler
(IPv4, port **5432** — needed for Payload's schema DDL; do NOT use the 6543
transaction pooler) works. Format:

```
DATABASE_URI=postgresql://postgres.<ref>:<db-password>@aws-0-<region>.pooler.supabase.com:5432/postgres
PAYLOAD_SECRET=<random 32-byte hex>
```

Both live in `.env.local` (gitignored). The project region is discoverable by
probing the regional poolers with `postgres.<ref>` if the dashboard string isn't
handy.

### Follow-ups after this PR
- **Create the first admin user** at `/cms` (owner's account — not scripted).
- **Email adapter:** Payload warns "no email adapter" (emails go to console). Wire
  the Resend adapter (Resend is already configured) so password resets etc. work.
- **App vs Payload projects:** the app's own Supabase keys in `.env` still point at
  a *different, older* project. If everything should live on the new SaverMiles
  project, migrate the app's `NEXT_PUBLIC_SUPABASE_URL` / keys too (its tables must
  be recreated there). Separate task.
- Wire Deal of the Week, `/blog`, testimonials to the frontend.

### Follow-ups noted

- The maintenance wall (`src/proxy.ts`) currently gates `/cms` too, so a CMS admin
  must hold the maintenance `admin_token` cookie first. Decide at launch whether to
  exempt `/cms`/`/cms-api` and let Payload's own auth be the sole gate.
- Media uploads use local disk (fine for dev); swap to a storage adapter
  (S3 / Supabase Storage) before production — serverless has no persistent disk.
- Payload adds ~444 packages; re-check `npm audit` (repo already had Dependabot alerts).
