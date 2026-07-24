import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import { getPayloadClient } from '@/lib/payload';
import { readingMinutes, mediaPublicUrl, type BlogCard } from '@/lib/blog';
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

export const metadata: Metadata = {
  title: 'Blog',
};

type MediaDoc = { alt?: string; filename?: string; sizes?: { card?: { filename?: string } } };
type CategoryDoc = { name?: string; slug?: string };

export default async function BlogIndexPage() {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'posts',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 100,
    depth: 1, // populate coverImage + category
  });

  const posts: BlogCard[] = docs.map((doc) => {
    const media = typeof doc.coverImage === 'object' ? (doc.coverImage as MediaDoc) : null;
    const cat = typeof doc.category === 'object' ? (doc.category as CategoryDoc) : null;
    // Prefer the 768w "card" render; fall back to the original file.
    const coverUrl = mediaPublicUrl(media?.sizes?.card?.filename ?? media?.filename ?? null);
    return {
      id: String(doc.id),
      title: String(doc.title),
      slug: String(doc.slug),
      excerpt: (doc.excerpt as string | undefined) ?? null,
      publishedAt: (doc.publishedAt as string | undefined) ?? null,
      readingMinutes: readingMinutes(doc.content),
      cover: coverUrl ? { url: coverUrl, alt: media?.alt || String(doc.title) } : null,
      category: cat?.name && cat?.slug ? { name: cat.name, slug: cat.slug } : null,
    };
  });

  return (
    <>
      <NavBar />
      <PageHero
        eyebrow="Blog"
        title="Notes on points, seats, and doing it by hand."
        intro="Field notes from searching award space the manual way — what the tools miss, and how to actually use the points you have."
      />
      <BlogIndex posts={posts} />
      <Footer />
    </>
  );
}
