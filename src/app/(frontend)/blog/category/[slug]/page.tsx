import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import { getPayloadClient } from '@/lib/payload';
import { toBlogCard, type BlogCard } from '@/lib/blog';
import BlogIndex from '../../BlogIndex';

/**
 * /blog/category/[slug] — published posts filed under one category, reusing the
 * blog grid (search on, category pills off). Generic: works for any category.
 * "Guides" and "Deals" are the two surfaced in the nav. Dynamic so the build
 * doesn't need the database.
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

async function getCategory(slug: string): Promise<CategoryDoc | null> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  });
  return (docs[0] as CategoryDoc | undefined) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: 'Blog' };
  return { title: COPY[slug]?.title ?? category.name };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();

  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'posts',
    where: {
      and: [{ _status: { equals: 'published' } }, { category: { equals: category.id } }],
    },
    sort: '-publishedAt',
    limit: 100,
    depth: 1,
  });
  const posts: BlogCard[] = docs.map(toBlogCard);

  const copy = COPY[slug];

  return (
    <>
      <NavBar />
      <PageHero
        compact
        eyebrow="Blog"
        title={copy?.title ?? category.name}
        intro={copy?.intro ?? `Everything we’ve filed under ${category.name}.`}
      />
      <BlogIndex posts={posts} hideFilters />
      <Footer />
    </>
  );
}
