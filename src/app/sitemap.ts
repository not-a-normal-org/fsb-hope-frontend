import type { MetadataRoute } from 'next';
import { DE_LIVE, localizePath } from '@/i18n/config';
import { getPayloadClient } from '@/lib/payload';
import { translatedPostSlugs } from '@/lib/cms-locale.server';
import { absoluteUrl } from '@/lib/seo';

/**
 * Dynamic sitemap: the public marketing routes plus every published blog post
 * (from Payload). Rendered on demand and wrapped in try/catch, so a build with
 * no database still emits the static routes.
 *
 * Once German is live (DE_LIVE), every page with a German version is listed in
 * both languages, each entry carrying hreflang alternates to the other. A blog
 * post gets its German entry only once it has a German title and body.
 */
export const dynamic = 'force-dynamic';

const STATIC_PATHS = [
  '',
  '/how-it-works',
  '/pricing',
  '/alerts',
  '/calculator',
  '/individual',
  '/business',
  '/about',
  '/blog',
  '/results',
  '/contact',
  '/legal/privacy',
  '/legal/terms',
  '/legal/cookies',
];

type Entry = MetadataRoute.Sitemap[number];

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((p) =>
    localized(p || '/', {
      lastModified: now,
      changeFrequency: 'weekly',
      priority: p === '' ? 1.0 : 0.7,
    }),
  );

  try {
    const payload = await getPayloadClient();
    const [{ docs }, german] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: { _status: { equals: 'published' } },
        sort: '-publishedAt',
        limit: 1000,
        depth: 0,
      }),
      DE_LIVE ? translatedPostSlugs('de') : Promise.resolve(new Set<string>()),
    ]);
    for (const post of docs) {
      entries.push(
        ...localized(
          `/blog/${post.slug}`,
          {
            lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
            changeFrequency: 'monthly',
            priority: 0.6,
          },
          german.has(String(post.slug)),
        ),
      );
    }

    const { docs: categories } = await payload.find({
      collection: 'categories',
      limit: 1000,
      depth: 0,
    });
    for (const category of categories) {
      entries.push(
        ...localized(`/blog/category/${category.slug}`, {
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.5,
        }),
      );
    }
  } catch {
    /* DB unavailable (e.g. a build without DATABASE_URI) — static routes only */
  }

  return entries;
}
