import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import { getPayloadClient } from '@/lib/payload';
import { mediaPublicUrl, readingMinutes, wordCount, extractFaq } from '@/lib/blog';
import {
  absoluteUrl,
  ogImageUrl,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  type PostSeo,
} from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';

/**
 * /blog/[slug] — a single PUBLISHED post from Payload (drafts stay private).
 * Byline is always "Saver Miles Team" (collection default; never a real name —
 * docs/plans/00). Full SEO: canonical, Open Graph (article), Twitter card, and
 * a BlogPosting JSON-LD block.
 */
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

// On a DB error, treat the post as not found (404) rather than throwing a 500.
async function getPost(slug: string) {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'posts',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 1, // populate coverImage + category + meta.image
    });
    return docs[0] ?? null;
  } catch {
    return null;
  }
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
    // Opt blog content into indexing over the site-wide default.
    robots: { index: true, follow: true },
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
  const catSlug = (category as { slug?: string } | null)?.slug;

  const reading = readingMinutes(post.content);
  const faqs = extractFaq(post.content);
  const crumbs = [
    { name: 'Home', url: SITE_URL },
    { name: 'Blog', url: absoluteUrl('/blog') },
    ...(category?.name && catSlug
      ? [{ name: category.name, url: absoluteUrl(`/blog/category/${catSlug}`) }]
      : []),
    { name: post.title, url: absoluteUrl(`/blog/${post.slug}`) },
  ];

  const jsonLd: Record<string, unknown>[] = [
    articleJsonLd(post as unknown as PostSeo, {
      wordCount: wordCount(post.content),
      section: category?.name || undefined,
    }),
    breadcrumbJsonLd(crumbs),
    ...(faqs.length ? [faqJsonLd(faqs)] : []),
  ];

  return (
    <>
      {jsonLd.map((block, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
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
              {` · ${reading} min read`}
            </p>
            <h1 className="mt-4 font-display text-hero font-bold text-ink">{post.title}</h1>
            {post.excerpt && (
              <p className="mt-5 text-lg leading-relaxed text-ink-sub">{post.excerpt}</p>
            )}
          </header>

          {(mediaPublicUrl(cover?.filename) ?? cover?.url) && (
            <div className="mt-10 overflow-hidden rounded-2xl" style={{ border: '1px solid var(--sm-glass-border)' }}>
              <Image
                src={(mediaPublicUrl(cover?.filename) ?? cover?.url) as string}
                alt={cover?.alt || post.title}
                width={cover?.width || 1200}
                height={cover?.height || 675}
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
