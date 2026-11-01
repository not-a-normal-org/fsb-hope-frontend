import type { MetadataRoute } from 'next';
import { DE_LIVE, localizePath } from '@/i18n/config';
import { getPayloadClient } from '@/lib/payload';
import { translatedPostSlugs } from '@/lib/cms-locale.server';
import { absoluteUrl } from '@/lib/seo';

/**
 * The sitemap: the public marketing routes plus every published blog post and
 * category (from Payload). If the database can't be reached it still emits the
 * static routes.
 *
 * Prebuilt and regenerated hourly (ISR), like /llms.txt, instead of rendered per
 * request: the dynamic version took 1.4 s and missed the CDN every time, and a
 * slow sitemap is one crawlers and audit tools give up on. A new post is listed
 * within the hour (IndexNow already pings Bing the moment it is published).
 *
 * `lastModified` is only given where it is true: a post's own `updatedAt`, and
 * for /blog and each category the newest post in it. The marketing and legal
 * pages have no edit date to report, so they carry none. They used to say
 * "now" on every fetch, which teaches Google to ignore lastmod for the whole
 * file, including the posts' real dates.
 *
 * Once German is live (DE_LIVE), every page with a German version is listed in
 * both languages, each entry carrying hreflang alternates to the other. A blog
 * post gets its German entry only once it has a German title and body.
 */
export const dynamic = 'force-static';
export const revalidate = 3600;

const STATIC_PATHS = [
  '/',
  '/how-it-works',
  '/pricing',
  '/alerts',
  '/calculator',
  '/individual',
  '/business',
  '/about',
  '/results',
  '/contact',
  '/legal/privacy',
  '/legal/terms',
  '/legal/cookies',
];

type Entry = MetadataRoute.Sitemap[number];
type PostRow = { slug?: string | null; updatedAt?: string | null; category?: unknown };

/** `path` in English, plus its German twin (both with alternates) when German is live. */
function localized(path: string, entry: Omit<Entry, 'url' | 'alternates'>, hasDe = true): Entry[] {
  const en = absoluteUrl(localizePath('en', path));
  if (!DE_LIVE || !hasDe) return [{ url: en, ...entry }];
  const de = absoluteUrl(localizePath('de', path));
  const alternates = { languages: { en, de, 'x-default': en } };
  return [
    { url: en, ...entry, alternates },
    { url: de, ...entry, alternates },
  ];
}

/** The latest of some ISO dates, as `{ lastModified }`, or nothing if there are none. */
function newest(dates: (string | null | undefined)[]): Pick<Entry, 'lastModified'> {
  const times = dates.filter(Boolean).map((d) => new Date(d as string).getTime());
  return times.length ? { lastModified: new Date(Math.max(...times)) } : {};
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let posts: PostRow[] = [];
  let categories: { id: number | string; slug?: string | null }[] = [];
  let german = new Set<string>();
  try {
    const payload = await getPayloadClient();
    const [postResult, categoryResult, germanSlugs] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: { _status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 1000,
        depth: 0,
      }),
      payload.find({ collection: 'categories', limit: 1000, depth: 0 }),
      DE_LIVE ? translatedPostSlugs('de') : Promise.resolve(new Set<string>()),
    ]);
    posts = postResult.docs as PostRow[];
    categories = categoryResult.docs;
    german = germanSlugs;
  } catch {
    /* DB unavailable (e.g. a build without DATABASE_URI) — static routes only */
  }

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((path) =>
    localized(path, { changeFrequency: 'weekly', priority: path === '/' ? 1.0 : 0.7 }),
  );

  entries.push(
    ...localized('/blog', {
      ...newest(posts.map((p) => p.updatedAt)),
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
  );

  for (const post of posts) {
    if (!post.slug) continue;
    entries.push(
      ...localized(
        `/blog/${post.slug}`,
        { ...newest([post.updatedAt]), changeFrequency: 'monthly', priority: 0.6 },
        german.has(post.slug),
      ),
    );
  }

  for (const category of categories) {
    if (!category.slug) continue;
    const inCategory = posts.filter((p) => String(p.category) === String(category.id));
    entries.push(
      ...localized(`/blog/category/${category.slug}`, {
        ...newest(inCategory.map((p) => p.updatedAt)),
        changeFrequency: 'weekly',
        priority: 0.5,
      }),
    );
  }

  return entries;
}
