import { SITE_URL, SITE_NAME } from './constants';

/** Absolute URL for a site path. */
export const absoluteUrl = (path: string): string => new URL(path, SITE_URL).toString();

type MediaLike = { url?: string | null } | string | null | undefined;
type MetaLike = { title?: string | null; description?: string | null; image?: MediaLike } | null;

export type PostSeo = {
  title: string;
  slug: string;
  excerpt?: string | null;
  publishedAt?: string | null;
  updatedAt?: string | null;
  meta?: MetaLike;
};

/**
 * Social image for a post: the author's manual override (SEO plugin `meta.image`)
 * if set, otherwise the auto-generated branded image at /blog/<slug>/og.
 */
export function ogImageUrl(post: PostSeo): string {
  const img = post.meta?.image;
  if (img && typeof img === 'object' && img.url) return absoluteUrl(img.url);
  return absoluteUrl(`/blog/${post.slug}/og`);
}

/** schema.org BlogPosting for a post — inject as application/ld+json. */
export function articleJsonLd(post: PostSeo): Record<string, unknown> {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || undefined,
    image: ogImageUrl(post),
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/savermiles-logo.png') },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };
}
