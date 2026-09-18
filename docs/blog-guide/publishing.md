# Publishing a post

Posts live in source control as `src/scripts/assets/blog/<slug>.md` plus `<slug>.jpg`.
`npm run seed:articles` (`src/scripts/seed-articles.ts`) upserts them into Payload by slug.

> ⚠ **The database in `.env.local` is production.** A seed publishes live, immediately, on
> savermiles.com. The sitemap, `/llms.txt` and RSS are rendered from that database on every
> request, so they update the moment the seed finishes. There is no deploy step.

## The one rule: seed only what changed

A full `npm run seed:articles` re-saves **every** post, which bumps every `updatedAt` and so every
sitemap `lastmod`. Google says it stops trusting `lastmod` when it changes without real edits
(PR #65's research). **Always pass `ONLY=`**, and only reseed a post after a real content change.

## Switches

| Env | Effect |
|---|---|
| `ONLY=slug[,slug]` | Seed only these posts. Unknown slugs fail before any write. |
| `SEED_DRY_RUN=1` | Validate and print a preflight report, then exit. **Never contacts the database.** |
| `RESEED_COVERS=1` | Re-upload covers from `<slug>.jpg` and delete the superseded media. Combine with `ONLY=`. |

The seed refuses to run when a slug isn't in `ORDER`, a file is missing, `CATEGORY` isn't `guides`
or `deals` (an unknown value would create a new public category), `SLUG` doesn't match the file,
or `TITLE` or `EXCERPT` is empty.

## Steps: a new post

1. Write `src/scripts/assets/blog/<slug>.md` following [`writing-guide.md`](writing-guide.md), and
   the cover `<slug>.jpg` following [`images.md`](images.md).
2. Add the slug to the **top** of `ORDER` in `seed-articles.ts`. The list is newest first, and a
   new post's `publishedAt` is `now − (its index) hours`.
3. Preflight, which is safe and doesn't touch the database:
   ```bash
   ONLY=<slug> SEED_DRY_RUN=1 npm run seed:articles
   grep -c '—' src/scripts/assets/blog/<slug>.md      # must be 0
   npx tsc --noEmit && npx eslint src
   ```
   Read the report: META_TITLE ≤46, META_DESCRIPTION ~140–155, EXCERPT ≤200, 4 FAQ questions,
   **the last answer contains no CTA**, no em dashes, cover present.
4. Publish, **logging to a file**. The CLI's progress spinner can hide the result line; one run
   looked fine but never wrote, and only the database showed it:
   ```bash
   ONLY=<slug> npm run seed:articles > /tmp/seed.log 2>&1; echo "exit=$?"
   sed 's/\x1b\[[0-9;]*[A-Za-z]//g' /tmp/seed.log | tr '\r' '\n' | grep -E '✓|↑|failed|Refusing'
   ```
   For a new post, expect exactly `↑ uploaded cover` and `✓ created "<slug>"`.
   **If the log holds only the two npm header lines, nothing ran and nothing was written.** It has
   happened on the first real run of a session (twice on 2026-09-18, exit code still 0); an
   immediate re-run worked both times. Dry runs never hit it. Root cause is still open, somewhere in
   `payload run`'s tsx loading. So never trust the exit code: confirm the `✓` line, then confirm on
   production.
5. Verify on production (below), then open the PR. The post is already live, so merging just
   lands the source files, which keeps future reseeds consistent.

## Steps: editing a live post
Make a genuine improvement, run the dry run, then `ONLY=<slug> npm run seed:articles`. Its
`lastmod` moves because the content changed; nothing else moves.

## Verify (production)

```bash
S=https://www.savermiles.com; P=<slug>
curl -s -o /dev/null -w "%{http_code}\n" $S/blog/$P                   # 200
curl -s $S/sitemap.xml | grep -A1 "/blog/$P<"                          # listed once, lastmod = today
curl -s $S/llms.txt | grep -c "/blog/$P"                               # ≥1
curl -s $S/blog/feed.xml | grep -c "/blog/$P"                          # ≥1
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" $S/blog/$P/og  # 200 image/png
```

Then check:
- The post's JSON-LD blocks: `BlogPosting` (with `wordCount` and `articleSection`),
  `BreadcrumbList`, and `FAQPage` with 4 questions and no CTA text in the last answer.
- The other posts' `lastmod` values in the sitemap haven't changed. Snapshot them before you
  publish.
- `/blog` shows the new post as "Latest", and its category page lists it.
- Related-posts and prev/next on neighbouring posts link to it.

After publishing, ask Search Console to index the new URL ("URL Inspection → Request indexing") and
make sure the sitemap is submitted there. Google retired the sitemap "ping" endpoint in 2023, so
Search Console is the only channel.

## Rollback
- Wrong copy: fix the markdown, then run `ONLY=<slug>` again.
- Pull a post entirely: set it to Draft in `/cms` (Posts). Drafts drop out of the blog, sitemap,
  RSS and llms.txt.

## Known debt
- `src/app/(frontend)/blog/page.tsx` has an open TODO: no `publishedAt <= now` filter on the index,
  so a future-dated post would show early. Don't schedule posts until that lands.
- Several older posts have META_TITLE over 46 characters or META_DESCRIPTION over 155 (the dry run
  flags them). Tidy them at each post's next real refresh, not in a bulk reseed.
