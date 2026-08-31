import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import { getPayloadClient } from '@/lib/payload';
import { toBlogCard, type BlogCard } from '@/lib/blog';
import { absoluteUrl, breadcrumbJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';
import BlogIndex from '../../BlogIndex';

/**
 * /blog/category/[slug] — published posts filed under one category, reusing the
 * blog grid (search on, category pills off). Generic: works for any category.
 * "Guides" and "Deals" are the two surfaced in the nav. Dynamic so the build
 * doesn't need the database.
 *
 * The nav links here must never dead-end: a slug we have tailored COPY for
 * (guides/deals) renders its hero + a graceful empty state even when the CMS has
 * no such category yet. Only a slug with neither a category doc nor COPY 404s.
 */
export const dynamic = 'force-dynamic';

/** Tailored hero copy for the marquee categories; others fall back to the name. */
const COPY: Record<string, { title: string; intro: string }> = {
  guides: {
    title: 'Guides',
    intro:
      'How award travel actually works — step-by-step playbooks from real, by-hand searches, not an algorithm’s guess.',
  },
  deals: {
    title: 'Deals',
    intro:
      'Standout award space and fare finds our team turned up by hand. Time-sensitive by nature — move while they last.',
  },
};

type CategoryDoc = { id: string | number; name: string; slug: string };

// A DB hiccup or an unmigrated table degrades to "no such category" rather than
// throwing a 500 — the page then decides 404 (unknown slug) vs empty state.
async function getCategory(slug: string): Promise<CategoryDoc | null> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    });
    return (docs[0] as CategoryDoc | undefined) ?? null;
  } catch {
    return null;
  }
}

async function getPosts(categoryId: string | number): Promise<BlogCard[]> {
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
    });
    return docs.map(toBlogCard);
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  const title = COPY[slug]?.title ?? category?.name ?? 'Blog';
  const description =
    COPY[slug]?.intro ?? (category ? `Everything we’ve filed under ${category.name}.` : undefined);
  const url = absoluteUrl(`/blog/category/${slug}`);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description },
    robots: { index: true, follow: true },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  const copy = COPY[slug];

  // Only a slug with neither a real category nor tailored copy is a true 404.
  // Guides/Deals (COPY) always render, empty state and all, so the nav links live.
  if (!category && !copy) notFound();

  const posts = category ? await getPosts(category.id) : [];

  const crumbs = [
    { name: 'Home', url: SITE_URL },
    { name: 'Blog', url: absoluteUrl('/blog') },
    { name: copy?.title ?? category?.name ?? slug, url: absoluteUrl(`/blog/category/${slug}`) },
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
        eyebrow="Blog"
        title={copy?.title ?? category?.name ?? slug}
        intro={
          copy?.intro ??
          (category ? `Everything we’ve filed under ${category.name}.` : '')
        }
      />
      <BlogIndex posts={posts} hideFilters />
      <Footer />
    </>
  );
}
