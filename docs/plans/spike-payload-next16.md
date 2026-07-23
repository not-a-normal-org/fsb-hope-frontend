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

## Recommended next steps (the Payload implementation, a separate feature)

1. `chore:` bump Next to 16.2.11, verify the existing site is unaffected.
2. Install Payload + `@payloadcms/db-postgres`, point its adapter at the **same**
   Supabase Postgres (confirm table-namespace separation from the app's own
   tables — see `docs/plans/06`).
3. Scaffold `payload.config` with the collections from `docs/plans/06`
   (`posts`, `categories`, `deals-of-week`, `testimonials`) — restrict admin to
   Moon/Tanzil.
4. Boot the admin, confirm it renders and migrates, then wire Deal of the Week,
   `/blog`, and the case-study/testimonials source.
