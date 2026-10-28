import type { Metadata } from 'next';

import { DE_LIVE, LIVE_LOCALES, LOCALE_TAGS, localizePath, type Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { SITE_URL, SITE_NAME } from './constants';

/** Absolute URL for a site path. */
export const absoluteUrl = (path: string): string => new URL(path, SITE_URL).toString();

/**
 * `alternates` for a public page: a self-referencing canonical in `locale`, plus
 * hreflang links to both languages (and `x-default` → English) once German is
 * live. `path` is the English path (`/pricing`). Pass `de: false` for a page with
 * no German version — e.g. a blog post nobody has translated yet — so search
 * engines are not pointed at a German URL that only repeats the English.
 */
export function localeAlternates(
  locale: Locale,
  path: string,
  opts: { de?: boolean } = {},
): NonNullable<Metadata['alternates']> {
  const canonical = absoluteUrl(localizePath(locale, path));
  if (!DE_LIVE || opts.de === false) return { canonical };
  const en = absoluteUrl(localizePath('en', path));
  return {
    canonical,
    languages: { en, de: absoluteUrl(localizePath('de', path)), 'x-default': en },
  };
}

/**
 * The per-language part of a public page's metadata: `alternates` (above), plus
 * `robots`. A page in a language that isn't live yet is always noindex — set here
 * rather than relying on the layout, because a page's own `robots` (e.g. the
 * legal pages' explicit `index: true`) would override the layout's.
 */
export function localeMeta(
  locale: Locale,
  path: string,
  opts: { de?: boolean; robots?: Metadata['robots'] } = {},
): Pick<Metadata, 'alternates' | 'robots'> {
  const hidden = !LIVE_LOCALES.includes(locale);
  const robots = hidden ? { index: false, follow: true } : opts.robots;
  return { alternates: localeAlternates(locale, path, opts), ...(robots ? { robots } : {}) };
}

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
  opts?: { wordCount?: number; section?: string; keywords?: string[]; locale?: Locale },
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
    inLanguage: LOCALE_TAGS[opts?.locale ?? 'en'],
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
export function organizationJsonLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    ...ORG,
    description: getMessages(locale).meta.organization,
  };
}

/** Site-wide WebSite entity. */
export function websiteJsonLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: DE_LIVE ? Object.values(LOCALE_TAGS) : LOCALE_TAGS[locale],
    publisher: ORG,
  };
}
