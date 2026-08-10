/**
 * Blog seed — sample Guides/Deals categories + a couple of published posts each,
 * so the /blog index and the /blog/category/{guides,deals} nav links resolve to
 * real content instead of an empty grid.
 *
 * Run: `npm run seed:blog` (→ `payload run src/scripts/seed-blog.ts`).
 * `payload run` loads `.env.local` (DATABASE_URI, PAYLOAD_SECRET) via @next/env.
 *
 * Idempotent: re-running skips anything already present (matched by slug).
 *
 * TEMPORARY / placeholder content — like the sample testimonial, this is meant
 * to be replaced or removed before launch. Every seeded post carries a
 * `[[SAMPLE]]` marker at the end of its body so it's trivial to find and delete
 * in the CMS. Delete this file once real posts exist.
 */
import { getPayload } from 'payload';
import config from '@payload-config';

/** Same slug algorithm the Posts collection uses (collections/Posts.ts). */
const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const SAMPLE_MARKER = '[[SAMPLE]] Placeholder content seeded by scripts/seed-blog.ts — safe to delete before launch.';

/** Minimal Lexical richText: two paragraphs (body + the sample marker). */
const richText = (body: string) => ({
  root: {
    type: 'root',
    format: '' as const,
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: [body, SAMPLE_MARKER].map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [{ type: 'text', format: 0, style: '', mode: 'normal', detail: 0, text, version: 1 }],
    })),
  },
});

const CATEGORIES = [
  { name: 'Guides', slug: 'guides' },
  { name: 'Deals', slug: 'deals' },
];

const POSTS: Array<{ title: string; categorySlug: string; excerpt: string; body: string }> = [
  {
    title: 'How Award Availability Actually Works',
    categorySlug: 'guides',
    excerpt:
      'Two seats on the same flight can cost wildly different miles. Here’s why — and how a by-hand search finds the cheaper one.',
    body: 'Award space is inventory an airline chooses to sell for points, and it moves constantly. A real person checking the right dates and partners often turns up seats the automated tools miss.',
  },
  {
    title: 'Transfer Partners, Explained',
    categorySlug: 'guides',
    excerpt:
      'Your points are worth more when you move them to the right airline. A plain-English map of who transfers where.',
    body: 'Flexible points can transfer to a range of airline and hotel programs. Knowing which partner prices a route cheapest is most of the work — and it’s work best done by hand.',
  },
  {
    title: 'Business Class to Tokyo on Points',
    categorySlug: 'deals',
    excerpt:
      'An example of the kind of award space our team turns up by hand. Time-sensitive by nature — move while it lasts.',
    body: 'Long-haul business class is where points stretch furthest. This is a sample of the award finds we surface — a real one would list the exact program, dates, and seat count.',
  },
  {
    title: 'Europe in Summer Without the Cash Price',
    categorySlug: 'deals',
    excerpt:
      'Peak-season award seats are rare but not impossible. An example of what to watch for.',
    body: 'Summer to Europe books out early, but partner space opens in waves. A hand search catches the windows an alert-only tool sleeps through.',
  },
];

async function main() {
  const payload = await getPayload({ config });

  // ── Categories ─────────────────────────────────────────────────────────────
  const categoryIdBySlug = new Map<string, number>();
  for (const cat of CATEGORIES) {
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: cat.slug } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs[0]) {
      categoryIdBySlug.set(cat.slug, existing.docs[0].id);
      console.log(`• category "${cat.slug}" already exists — skipped`);
      continue;
    }
    const created = await payload.create({ collection: 'categories', data: cat });
    categoryIdBySlug.set(cat.slug, created.id);
    console.log(`✓ created category "${cat.slug}"`);
  }

  // ── Posts ──────────────────────────────────────────────────────────────────
  for (const post of POSTS) {
    const slug = formatSlug(post.title);
    const existing = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    if (existing.docs[0]) {
      console.log(`• post "${slug}" already exists — skipped`);
      continue;
    }
    const category = categoryIdBySlug.get(post.categorySlug);
    await payload.create({
      collection: 'posts',
      data: {
        title: post.title,
        excerpt: post.excerpt,
        category,
        publishedAt: new Date().toISOString(),
        _status: 'published',
        content: richText(post.body),
      },
    });
    console.log(`✓ created post "${slug}" (${post.categorySlug})`);
  }

  console.log('\nBlog seed complete.');
  await flush();
}

/** Drain stdout/stderr before the process exits — otherwise piped output is lost. */
const flush = () =>
  new Promise<void>((resolve) => {
    let pending = 2;
    const done = () => --pending === 0 && resolve();
    process.stdout.write('', done);
    process.stderr.write('', done);
  });

// Run via tsx (see the `seed:blog` npm script). Top-level await runs main() to
// completion; the explicit process.exit closes the open Postgres pool so the
// process doesn't hang.
try {
  await main();
  await flush();
  process.exit(0);
} catch (err) {
  console.error('Blog seed failed:', err);
  await flush();
  process.exit(1);
}
