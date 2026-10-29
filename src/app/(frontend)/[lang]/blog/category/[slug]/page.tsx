import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import { getPayloadClient } from '@/lib/payload';
import { toBlogCard, type BlogCard } from '@/lib/blog';
import { absoluteUrl, breadcrumbJsonLd, localeMeta } from '@/lib/seo';
import { getMessages, resolveLocale } from '@/i18n/get-messages';
import { fmt } from '@/i18n/format';
import { OG_LOCALES, localizePath, type Locale } from '@/i18n/config';
import { SITE_URL } from '@/lib/constants';
import BlogIndex from '../../BlogIndex';

/**
 * /blog/category/[slug] — published posts filed under one category, reusing the
 * blog grid (search on, category pills off). Generic: works for any category.
 * "Guides" and "Deals" are the two surfaced in the nav. Dynamic so the build
 * doesn't need the database.
 *
 * The nav links here must never dead-end: a slug we have tailored copy for
 * (guides/deals) renders its hero + a graceful empty state even when the CMS has
 * no such category yet. Only a slug with neither a category doc nor tailored copy 404s.
 */
export const dynamic = 'force-dynamic';

/** Tailored hero copy (`blog.category` in the dictionaries) for the marquee
 *  categories; others fall back to the CMS name. */
const TAILORED = ['guides', 'deals'] as const;

function tailoredCopy(locale: Locale, slug: string): { title: string; intro: string } | undefined {
  const m = getMessages(locale).blog.category;
  return (TAILORED as readonly string[]).includes(slug)
    ? m[slug as (typeof TAILORED)[number]]
    : undefined;
}

type CategoryDoc = { id: string | number; name: string; slug: string };

// A DB hiccup or an unmigrated table degrades to "no such category" rather than
// throwing a 500 — the page then decides 404 (unknown slug) vs empty state.
async function getCategory(slug: string, locale: Locale): Promise<CategoryDoc | null> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      locale,
    });
    return (docs[0] as CategoryDoc | undefined) ?? null;
  } catch {
    return null;
  }
}

async function getPosts(categoryId: string | number, locale: Locale): Promise<BlogCard[]> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'posts',
      where: {
        and: [{ _status: { equals: 'published' } }, { category: { equals: categoryId } }],
      },
      sort: '-publishedAt',
      limit: 100,
      depth: 1,
      locale, // untranslated posts fall back to English
    });
    return docs.map(toBlogCard);
  } catch {
    return [];
  }
}

type Params = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const [locale, { slug }] = await Promise.all([resolveLocale(params), params]);
  const category = await getCategory(slug, locale);
  const { blog } = getMessages(locale);
  const copy = tailoredCopy(locale, slug);
  const title = copy?.title ?? category?.name ?? blog.title;
  const description =
    copy?.intro ?? (category ? fmt(blog.category.filedUnder, { name: category.name }) : undefined);
  const path = `/blog/category/${slug}`;
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: absoluteUrl(localizePath(locale, path)),
      locale: OG_LOCALES[locale],
      title,
      description,
    },
    ...localeMeta(locale, path, { robots: { index: true, follow: true } }),
  };
}

export default async function CategoryPage({ params }: Params) {
  const [locale, { slug }] = await Promise.all([resolveLocale(params), params]);
  const category = await getCategory(slug, locale);
  const { blog } = getMessages(locale);
  const copy = tailoredCopy(locale, slug);

  // Only a slug with neither a real category nor tailored copy is a true 404.
  // Guides/Deals (tailored copy) always render, empty state and all, so the nav links live.
  if (!category && !copy) notFound();

  const posts = category ? await getPosts(category.id, locale) : [];

  const crumbs = [
    { name: blog.home, url: locale === 'en' ? SITE_URL : absoluteUrl(localizePath(locale, '/')) },
    { name: blog.title, url: absoluteUrl(localizePath(locale, '/blog')) },
    {
      name: copy?.title ?? category?.name ?? slug,
      url: absoluteUrl(localizePath(locale, `/blog/category/${slug}`)),
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }}
      />
      <NavBar />
      <PageHero
        compact
        eyebrow={blog.hero.eyebrow}
        title={copy?.title ?? category?.name ?? slug}
        intro={
          copy?.intro ?? (category ? fmt(blog.category.filedUnder, { name: category.name }) : '')
        }
      />
      <BlogIndex posts={posts} m={blog.index} hideFilters />
      <Footer />
    </>
  );
}
