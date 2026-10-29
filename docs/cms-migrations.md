# CMS schema migrations

Payload's tables live in the `payload` schema of the **production** Supabase
database, and local `npm run dev` uses that same database. So Payload no longer
syncs its schema on its own: `push: false` in `src/payload.config.ts`. Every
schema change is a migration in `src/migrations/`, reviewed in a PR and run on
purpose.

Before this, dev "pushed" schema changes straight to production. That was a
live, unreviewed change. Localizing a field would have been a `DROP COLUMN` of
every post's title and body.

## Rules

- **Never run Payload against production with an old checkout.** A checkout from
  before `push: false` still dev-pushes. After a migration it would try to push
  the *old* schema back, and drizzle offers to drop the new tables. Pull `main`
  before `npm run dev`.
- **Generate migrations against a throwaway local Postgres, never production.**
- **Read the generated SQL.** The generator only creates and drops. If it drops a
  column whose data must survive, add a copy step in between. See
  `20261028_105347_localize_content.ts`.

## Making a schema change

1. Start a throwaway database and bring it to the current state:

   ```sh
   docker run -d --name payload-scratch -e POSTGRES_PASSWORD=local -p 127.0.0.1:54329:5432 postgres:17-alpine
   export DATABASE_URI=postgres://postgres:local@127.0.0.1:54329/postgres
   npx payload migrate          # the baseline builds every table on an empty database
   ```

2. Change the collection or config, then generate in a **real terminal**:

   ```sh
   npx payload migrate:create <name>
   ```

   Drizzle may ask "Is X created or renamed from another column?". That prompt
   needs a TTY. Run without one (an agent, CI), it exits silently and writes no
   file. A new column is almost always "create column".

3. Read the SQL. Add any data copy. Then prove it on the scratch database:
   `npx payload migrate`, check the data, `npx payload migrate:down`, and
   `npx payload migrate` again.

4. Open a PR. Production runs the migration **right before** the merge (below).
   Production Payload never migrates by itself, so new code on `main` against an
   unmigrated database fails.

## Production run

Tell the team first. Nobody saves in `/cms`, and everyone stops local
`npm run dev`, until the last step is done. **Between the migration and the
deploy, the live code reads columns that no longer exist**, so every visitor to
the blog, results pages and `/cms` gets errors for those few minutes (the
localization migration, 2026-10-29, ran with the site already public: about
three minutes). Run at low traffic, and have the PR ready to merge the moment
the migration finishes.

*Done once already:* `localize_content` ran on production on 2026-10-29
(rehearsed on a restored backup first; English content verified identical
before/after). The steps stay here for the next migration.

You need two connection strings from Supabase → Settings → Database →
Connection string:
- `DATABASE_URI`, the usual transaction pooler (port 6543), for the migration.
- The **session pooler** (port 5432), only for `pg_dump`/`pg_restore`. They need a
  real session. Use it briefly; it is capped at 15 clients (see
  `src/lib/database-uri.ts`).

```sh
export PROD_URI='postgres://…:6543/postgres'            # transaction pooler
export PROD_SESSION_URI='postgres://…:5432/postgres'    # session pooler
```

**1. Back up the `payload` schema.** The Postgres 17 image matches Supabase's
server version, and an older local `pg_dump` refuses to dump a newer server.

```sh
docker run --rm -v "$PWD:/out" postgres:17-alpine \
  pg_dump "$PROD_SESSION_URI" --schema=payload -Fc -f /out/payload-backup-$(date +%Y%m%d-%H%M).dump
```

**2. Rehearse on a copy (recommended).** Restore the dump into the scratch
container, then run steps 3–4 against `DATABASE_URI=<scratch>`. Before
migrating, write a JSON snapshot of the English content with
`payload.find({ collection, locale: 'en', draft: true, limit: 1000 })` for
`posts`, `categories`, `testimonials` and `media`, plus
`findVersions({ collection: 'posts' })`. Write another snapshot after, and
diff them. The only difference should be two new `null` fields on post
versions (`snapshot`, `publishedLocale`).

**3. Register the baseline.** Production's tables were created by dev push, so
the baseline must be recorded as already applied, never run. Look first:

```sh
psql "$PROD_URI" -c "select name, batch from payload.payload_migrations"
# expected: one row, name 'dev', batch -1 (the dev-push marker)
psql "$PROD_URI" -c "begin;
  delete from payload.payload_migrations where batch = -1;
  insert into payload.payload_migrations (name, batch) values ('20261028_104903_baseline', 1);
commit;"
```

**4. Migrate**, from a checkout of the migration's PR branch. Run it plainly, not
through a pseudo-terminal wrapper (one silently exited before connecting):

```sh
DATABASE_URI="$PROD_URI" npx payload migrate
# Migrating: 20261028_105347_localize_content
# Migrated:  20261028_105347_localize_content (…ms)
```

It runs in one transaction. If anything fails, nothing is changed.

**5. Merge the PR right away**, and wait for the Vercel deploy (~2–3 min).

**6. Check:**
- `/blog`, a post, `/results` and a case study render in English as before.
- `/cms`: open a post. The locale switcher shows English and Deutsch, and the
  English fields hold the same text as before.
- Then lift the CMS freeze.

### Rollback

- **Before the merge:** `DATABASE_URI="$PROD_URI" npx payload migrate:down`.
  This copies English back into the original columns and drops the locale
  tables. Any German entered since is lost.
- **Or restore the backup:**
  `docker run --rm -v "$PWD:/in" postgres:17-alpine pg_restore --clean --if-exists --schema=payload -d "$PROD_SESSION_URI" /in/<file>.dump`.
- **After the merge:** revert the PR as well.
