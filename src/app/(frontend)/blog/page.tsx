import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import { getPayloadClient } from '@/lib/payload';
import { toBlogCard, type BlogCard } from '@/lib/blog';
import { absoluteUrl, breadcrumbJsonLd } from '@/lib/seo';
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

const BLOG_DESC =
  'Guides to booking flights with points and miles, checked by a real specialist — not an algorithm.';

export const metadata: Metadata = {
  title: 'Blog',
  description: BLOG_DESC,
  alternates: {
    canonical: absoluteUrl('/blog'),
    types: { 'application/rss+xml': absoluteUrl('/blog/feed.xml') },
  },
  openGraph: { type: 'website', url: absoluteUrl('/blog'), title: `Blog | ${SITE_NAME}`, description: BLOG_DESC },
  robots: { index: true, follow: true },
};

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

export default async function BlogIndexPage() {
  const posts = await getPosts();

  const blogJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} — Blog`,
    url: absoluteUrl('/blog'),
    description: BLOG_DESC,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: p.publishedAt || undefined,
    })),
  };
  const crumbs = [
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Blog', url: absoluteUrl('/blog') },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(crumbs)) }} />
      <NavBar />
      <PageHero
        compact
        eyebrow="Blog"
        title="Notes on points, seats, and doing it by hand."
        intro="Field notes from working award space the slow, correct way: what the tools miss, and how to actually use the points you have."
      />
      <BlogIndex posts={posts} />
      <Footer />
    </>
  );
}
