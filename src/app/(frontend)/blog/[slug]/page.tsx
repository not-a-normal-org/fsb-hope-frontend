import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import { getPayloadClient } from '@/lib/payload';
import { absoluteUrl, ogImageUrl, articleJsonLd, type PostSeo } from '@/lib/seo';

/**
 * /blog/[slug] — a single PUBLISHED post from Payload (drafts stay private).
 * Byline is always "Saver Miles Team" (collection default; never a real name —
 * docs/plans/00). Full SEO: canonical, Open Graph (article), Twitter card, and
 * a BlogPosting JSON-LD block.
 */
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

async function getPost(slug: string) {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
    limit: 1,
    depth: 1, // populate coverImage + category + meta.image
  });
  return docs[0] ?? null;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Not found', robots: 'noindex' };

  const url = absoluteUrl(`/blog/${post.slug}`);
  const title = post.meta?.title || post.title;
  const description = post.meta?.description || post.excerpt || undefined;
  const image = ogImageUrl(post as unknown as PostSeo);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? post.publishedAt ?? undefined,
      authors: ['Saver Miles Team'],
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const cover = typeof post.coverImage === 'object' && post.coverImage ? post.coverImage : null;
  const category = typeof post.category === 'object' && post.category ? post.category : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(post as unknown as PostSeo)) }}
      />
      <NavBar />

      <article className="relative">
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-16 md:pt-20">
          <Link href="/blog" className="text-sm text-ink-sub transition-colors hover:text-ink">
            ← All posts
          </Link>

          <header className="mt-8">
            <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
              {category?.name ? `${category.name} · ` : ''}
              {post.author || 'Saver Miles Team'}
              {date ? ` · ${date}` : ''}
            </p>
            <h1 className="mt-4 font-display text-hero font-bold text-ink">{post.title}</h1>
            {post.excerpt && (
              <p className="mt-5 text-lg leading-relaxed text-ink-sub">{post.excerpt}</p>
            )}
          </header>

          {cover?.url && (
            <div className="mt-10 overflow-hidden rounded-2xl" style={{ border: '1px solid var(--sm-glass-border)' }}>
              <Image
                src={cover.url}
                alt={cover.alt || post.title}
                width={cover.width || 1200}
                height={cover.height || 675}
                className="h-auto w-full"
              />
            </div>
          )}

          {post.content && (
            <div className="sm-prose mt-10 text-ink-sub">
              <RichText data={post.content as SerializedEditorState} />
            </div>
          )}
        </div>
      </article>

      <Footer />
    </>
  );
}
