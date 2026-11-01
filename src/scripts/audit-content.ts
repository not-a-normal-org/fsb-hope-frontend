/**
 * Read-only audit of blog content: what the CMS holds vs what the repo holds,
 * and which posts exist in German.
 *
 *   npm run audit:content
 *
 * Why this exists. `src/scripts/seed-articles.ts` treats the repo as the source
 * of truth: it reads `src/scripts/assets/blog/<slug>.md` and writes the CMS. A
 * post authored directly in `/cms` has no repo markdown, so every repo-iterating
 * tool silently skips it: `ONLY=` seeding, `RESEED_COVERS=1`, the cover-drift
 * audit, and any sweep for retired copy. That drift is invisible until something
 * depends on it, which is exactly how nine rejected covers stayed live for five
 * weeks. This script makes it visible.
 *
 * It only reads. It contacts the database configured in the environment, which
 * for local work is PRODUCTION (`push: false`, see docs/cms-migrations.md), so
 * it is safe to run but it is not free: don't put it in a loop.
 */
import fs from 'node:fs';
import path from 'node:path';

import { getPayload } from 'payload';
import config from '@payload-config';

import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config';

const ASSETS = path.join(process.cwd(), 'src/scripts/assets/blog');

/** Does the repo hold markdown for this slug in this language? */
const repoMarkdown = (slug: string, locale: Locale): boolean =>
  fs.existsSync(
    locale === DEFAULT_LOCALE
      ? path.join(ASSETS, `${slug}.md`)
      : path.join(ASSETS, locale, `${slug}.md`),
  );

type Row = { id: number | string; slug?: string | null; title?: unknown; content?: unknown };

/** A document is translated when it has its own title AND body in that locale. */
const translated = (doc: Row | undefined | null): boolean => Boolean(doc?.title && doc?.content);

async function main(): Promise<void> {
  console.log('Reading posts from the configured database...');
  // Not `@/lib/payload` — that module is `server-only` and will not resolve
  // under `payload run`. Scripts build their own client, as seed-articles does.
  const payload = await getPayload({ config });

  // `draft: true` so unpublished posts show up too — a draft with no repo
  // markdown is the same drift, just not public yet.
  const { docs } = await payload.find({
    collection: 'posts',
    draft: true,
    limit: 1000,
    depth: 0,
    sort: '-publishedAt',
  });

  const nonDefault = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

  const rows: {
    slug: string;
    status: string;
    repo: Record<string, boolean>;
    cms: Record<string, boolean>;
  }[] = [];

  for (const doc of docs as (Row & { _status?: string })[]) {
    const slug = String(doc.slug ?? `(no slug, id ${doc.id})`);
    const repo: Record<string, boolean> = { [DEFAULT_LOCALE]: repoMarkdown(slug, DEFAULT_LOCALE) };
    const cms: Record<string, boolean> = { [DEFAULT_LOCALE]: true };

    for (const locale of nonDefault) {
      repo[locale] = repoMarkdown(slug, locale);
      const localized = (await payload.findByID({
        collection: 'posts',
        id: doc.id,
        locale,
        fallbackLocale: false,
        depth: 0,
        disableErrors: true,
      })) as Row | null;
      cms[locale] = translated(localized);
    }

    rows.push({ slug, status: doc._status ?? 'unknown', repo, cms });
  }

  const cols = [DEFAULT_LOCALE, ...nonDefault];
  const head = `${'slug'.padEnd(48)} ${'status'.padEnd(10)} ${cols
    .map((l) => `repo:${l}`.padEnd(9))
    .join(' ')} ${cols.map((l) => `cms:${l}`.padEnd(8)).join(' ')}`;
  console.log(`\n${head}\n${'-'.repeat(head.length)}`);

  const mark = (ok: boolean) => (ok ? 'yes' : 'NO');
  for (const r of rows) {
    console.log(
      `${r.slug.padEnd(48)} ${r.status.padEnd(10)} ${cols
        .map((l) => mark(r.repo[l]).padEnd(9))
        .join(' ')} ${cols.map((l) => mark(r.cms[l]).padEnd(8)).join(' ')}`,
    );
  }

  // The two findings worth acting on.
  const cmsOnly = rows.filter((r) => !r.repo[DEFAULT_LOCALE]);
  const missingTranslation = rows.filter((r) => nonDefault.some((l) => !r.cms[l]));

  console.log(`\n${rows.length} post(s) in the CMS.`);

  if (cmsOnly.length) {
    console.log(
      `\n⚠ ${cmsOnly.length} authored in the CMS with no repo markdown — every repo-iterating\n` +
        `  tool skips these (ONLY= seeding, RESEED_COVERS, cover-drift audit, copy sweeps):`,
    );
    for (const r of cmsOnly) console.log(`    ${r.slug}`);
  } else {
    console.log('\n✓ every CMS post has repo markdown.');
  }

  if (missingTranslation.length) {
    console.log(`\n⚠ ${missingTranslation.length} post(s) not translated in the CMS:`);
    for (const r of missingTranslation) {
      const missing = nonDefault.filter((l) => !r.cms[l]);
      const haveSource = nonDefault.filter((l) => !r.cms[l] && r.repo[l]);
      const note = haveSource.length
        ? `repo markdown EXISTS (${haveSource.join(', ')}) — just needs LOCALE=<l> ONLY=${r.slug}`
        : 'no repo markdown either — needs writing';
      console.log(`    ${r.slug.padEnd(48)} missing ${missing.join(', ')}  ·  ${note}`);
    }
  } else {
    console.log('\n✓ every CMS post is translated in every language.');
  }

  console.log('');
}

/** Drain stdout/stderr before process.exit, or piped output is lost. */
const flush = () =>
  new Promise<void>((resolve) => {
    let pending = 2;
    const done = () => --pending === 0 && resolve();
    process.stdout.write('', done);
    process.stderr.write('', done);
  });

// Top-level await, as the other scripts do. `payload run` exits as soon as module
// evaluation finishes (payload/dist/bin/index.js calls process.exit(0)), so a
// floating `main().catch(...)` is killed before it does any work.
try {
  await main();
  await flush();
  process.exit(0);
} catch (err) {
  console.error('Content audit failed:', err);
  await flush();
  process.exit(1);
}
