import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/constants';
import { getPayloadClient } from '@/lib/payload';

/**
 * Dynamic sitemap: the public marketing routes plus every published blog post
 * (from Payload). Rendered on demand and wrapped in try/catch, so a build with
 * no database still emits the static routes.
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
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '' ? 1.0 : 0.7,
  }));

  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 1000,
      depth: 0,
    });
    for (const post of docs) {
      entries.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }

    const { docs: categories } = await payload.find({
      collection: 'categories',
      limit: 1000,
      depth: 0,
    });
    for (const category of categories) {
      entries.push({
        url: `${SITE_URL}/blog/category/${category.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.5,
      });
    }
  } catch {
    /* DB unavailable (e.g. a build without DATABASE_URI) — static routes only */
  }

  return entries;
}
