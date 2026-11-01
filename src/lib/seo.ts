import type { Metadata } from 'next';

import { DE_LIVE, LIVE_LOCALES, LOCALE_TAGS, OG_LOCALES, localizePath, type Locale } from '@/i18n/config';
import { getMessages } from '@/i18n/get-messages';
import { SITE_URL, SITE_NAME, SITE_LEGAL_NAME, SITE_EMAIL, SITE_ADDRESS } from './constants';
import { PRICES_USD, withCopy } from './products';

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
  // max-image-preview:large lets Google show a large image for the page in Search
  // and Discover; without it, Discover only shows a thumbnail.
  const robots: Metadata['robots'] = hidden
    ? { index: false, follow: true }
    : { ...(typeof opts.robots === 'object' ? opts.robots : {}), 'max-image-preview': 'large' };
  return { alternates: localeAlternates(locale, path, opts), robots };
}

/** The site's link-preview card (public/og-image.png, public/twitter-image.png). */
export const OG_IMAGE = { url: '/og-image.png', width: 1200, height: 630, alt: SITE_NAME };
export const TWITTER_IMAGE = '/twitter-image.png';

/**
 * A public page's whole metadata from its title and description: <title>, meta
 * description, the Open Graph and Twitter cards, canonical + hreflang, robots.
 *
 * Next replaces a parent's `openGraph`/`twitter` instead of merging into it. A
 * page that set only its title inherited the layout's card, with the home page's
 * og:title and og:url; a page that set its own og:title lost the preview image.
 * So every page gets a complete card here. `title` goes through the layout's
 * "%s | Saver Miles" template unless `absoluteTitle` is set (the home page).
 */
export function pageMeta(
  locale: Locale,
  path: string,
  {
    title,
    description,
    absoluteTitle = false,
    robots,
  }: { title: string; description?: string; absoluteTitle?: boolean; robots?: Metadata['robots'] },
): Metadata {
  const cardTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      url: absoluteUrl(localizePath(locale, path)),
      title: cardTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: { card: 'summary_large_image', title: cardTitle, description, images: [TWITTER_IMAGE] },
    ...localeMeta(locale, path, { robots }),
  };
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
export function ogImageUrl(post: PostSeo, locale: Locale = 'en'): string {
  const img = post.meta?.image;
  if (img && typeof img === 'object' && img.url) return absoluteUrl(img.url);
  return absoluteUrl(localizePath(locale, `/blog/${post.slug}/og`));
}

/**
 * The Organization as every JSON-LD block names it. The logo is the square social
 * avatar (the full lockup on its own dark ground): Google shows the logo on white
 * and wants it at least 112px square, which the transparent, cream-lettered nav
 * lockup is not. `@id` ties author/publisher on every page to the one entity.
 */
const ORG = {
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: absoluteUrl('/img/savermiles-avatar.png'), width: 1000, height: 1000 },
} as const;

/** schema.org BlogPosting for a post — inject as application/ld+json. */
export function articleJsonLd(
  post: PostSeo,
  opts?: {
    wordCount?: number;
    section?: string;
    keywords?: string[];
    locale?: Locale;
    /** The cover photo (absolute URL, ideally ≥1200px wide), listed before the generated card. */
    coverUrl?: string | null;
  },
): Record<string, unknown> {
  const url = absoluteUrl(localizePath(opts?.locale ?? 'en', `/blog/${post.slug}`));
  // Google's Article guidance: real, high-resolution images (≥1200px wide for
  // large previews). The cover photo first, then the 1200×630 branded card.
  const images = [...new Set([opts?.coverUrl, ogImageUrl(post, opts?.locale)].filter(Boolean))];
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.meta?.title || post.title,
    description: post.meta?.description || post.excerpt || undefined,
    image: images.length === 1 ? images[0] : images,
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

/**
 * Site-wide Organization entity — helps search + AI resolve who we are. Every
 * field is something the site already states (legal pages, footer, contact).
 * Support is listed in English only: the team doesn't promise German replies.
 */
export function organizationJsonLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    ...ORG,
    legalName: SITE_LEGAL_NAME,
    description: getMessages(locale).meta.organization,
    email: SITE_EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_ADDRESS.street,
      addressLocality: SITE_ADDRESS.locality,
      addressRegion: SITE_ADDRESS.region,
      postalCode: SITE_ADDRESS.postalCode,
      addressCountry: SITE_ADDRESS.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: SITE_EMAIL,
      availableLanguage: ['English'],
    },
  };
}

/**
 * The service and every published price, as /pricing shows them — so search and
 * answer engines can state what Saver Miles sells and what it costs without
 * guessing. Names and descriptions come from the product copy, amounts from
 * PRICES_USD, so this can't drift from the page. Business is quoted per account
 * and has no price.
 */
export function serviceJsonLd(locale: Locale): Record<string, unknown> {
  const m = getMessages(locale);
  const url = absoluteUrl(localizePath(locale, '/pricing'));
  const usd = (price: number, name: string, unitCode?: 'MON' | 'ANN') => ({
    '@type': 'UnitPriceSpecification',
    price,
    priceCurrency: 'USD',
    name,
    ...(unitCode ? { referenceQuantity: { '@type': 'QuantitativeValue', value: 1, unitCode } } : {}),
  });
  const offer = (id: 'individual' | 'business' | 'weekly' | 'human', priceSpecification?: unknown[]) => {
    const p = withCopy(id, m.products);
    return {
      '@type': 'Offer',
      name: p.name,
      description: p.description,
      url: absoluteUrl(localizePath(locale, p.href)),
      ...(priceSpecification ? { priceSpecification } : {}),
    };
  };
  const individual = m.products.individual;
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: SITE_NAME,
    serviceType: m.seo.serviceType,
    description: m.meta.organization,
    url,
    provider: ORG,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: m.pricing.title,
      itemListElement: [
        offer('individual', [
          usd(PRICES_USD.deposit, individual.priceUnit),
          usd(PRICES_USD.successFee, individual.priceSub.replace(/^\+\s*/, '')),
        ]),
        offer('business'),
        offer('weekly', [
          usd(PRICES_USD.weeklyMonthly, m.checkout.monthly, 'MON'),
          usd(PRICES_USD.weeklyAnnual, m.checkout.annual, 'ANN'),
        ]),
        offer('human', [
          usd(PRICES_USD.humanMonthly, m.checkout.monthly, 'MON'),
          usd(PRICES_USD.humanAnnual, m.checkout.annual, 'ANN'),
        ]),
      ],
    },
  };
}

/** Site-wide WebSite entity. */
export function websiteJsonLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    // The logo's wordmark reads "SaverMiles"; Google's site-name system accepts both.
    alternateName: 'SaverMiles',
    url: SITE_URL,
    inLanguage: DE_LIVE ? Object.values(LOCALE_TAGS) : LOCALE_TAGS[locale],
    publisher: ORG,
  };
}
