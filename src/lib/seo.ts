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

const ORG = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: absoluteUrl('/savermiles-logo.png'), width: 512, height: 512 },
} as const;

/** schema.org BlogPosting for a post — inject as application/ld+json. */
export function articleJsonLd(
  post: PostSeo,
  opts?: { wordCount?: number; section?: string; keywords?: string[] },
): Record<string, unknown> {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || undefined,
    image: ogImageUrl(post),
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    inLanguage: 'en-US',
    ...(opts?.wordCount ? { wordCount: opts.wordCount } : {}),
    ...(opts?.section ? { articleSection: opts.section } : {}),
    ...(opts?.keywords?.length ? { keywords: opts.keywords.join(', ') } : {}),
    author: ORG,
    publisher: ORG,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };
}

/** schema.org BreadcrumbList — inject as application/ld+json. */
export function breadcrumbJsonLd(items: { name: string; url: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

/** schema.org FAQPage from extracted Q&A pairs (omit when empty). */
export function faqJsonLd(faqs: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** Site-wide Organization entity — helps search + AI resolve who we are. */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    ...ORG,
    description:
      'A manual, human-run points-and-miles concierge. A real specialist searches award space by hand across 30+ loyalty programs and hands you a bookable seat with the exact point cost.',
  };
}

/** Site-wide WebSite entity. */
export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    publisher: ORG,
  };
}
