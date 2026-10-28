import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import { getPayloadClient } from '@/lib/payload';
import { toBlogCard, type BlogCard } from '@/lib/blog';
import { absoluteUrl, breadcrumbJsonLd, localeMeta } from '@/lib/seo';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { OG_LOCALES, localizePath } from '@/i18n/config';
import { SITE_NAME } from '@/lib/constants';
import BlogIndex from './BlogIndex';

/**
 * /blog — index of published posts (docs/plans/02, 06). Dynamic: queries the
 * CMS at request time so the build doesn't need the database. The server maps
 * each post to a small card shape and hands it to the client grid, which owns
 * search + category filtering.
 *
 * TODO (pre-launch): filter to `publishedAt <= now` for the public. Behind the
 * construction wall it's fine to show everything so authors can preview drafts.
 */
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = getMessages(locale).blog;
  const { alternates, robots } = localeMeta(locale, '/blog', { robots: { index: true, follow: true } });
  return {
    title,
    description,
    alternates: {
      ...alternates,
      types: { 'application/rss+xml': absoluteUrl(localizePath(locale, '/blog/feed.xml')) },
    },
    openGraph: {
      type: 'website',
      url: absoluteUrl(localizePath(locale, '/blog')),
      locale: OG_LOCALES[locale],
      title: `${title} | ${SITE_NAME}`,
      description,
    },
    robots,
  };
}

// A DB hiccup or an unmigrated `posts` table degrades to an empty grid (the
// grid's own "just getting started" empty state) instead of a 500.
async function getPosts(): Promise<BlogCard[]> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 100,
      depth: 1, // populate coverImage + category
    });
    return docs.map(toBlogCard);
  } catch {
    return [];
  }
}

export default async function BlogIndexPage({ params }: { params: LangParams }) {
  const [locale, posts] = await Promise.all([resolveLocale(params), getPosts()]);
  const m = getMessages(locale).blog;

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} — Blog`,
    url: absoluteUrl(localizePath(locale, '/blog')),
    description: m.description,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: p.publishedAt || undefined,
    })),
  };
  const crumbs = [
    { name: m.home, url: absoluteUrl(localizePath(locale, '/')) },
    { name: m.title, url: absoluteUrl(localizePath(locale, '/blog')) },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <NavBar />
      <PageHero compact {...m.hero} />
      <BlogIndex posts={posts} m={m.index} />
      <Footer />
    </>
  );
}
