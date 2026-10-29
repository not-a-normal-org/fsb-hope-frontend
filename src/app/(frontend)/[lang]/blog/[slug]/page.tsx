import type { Metadata } from 'next';
import { cache } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical';

import Link from '@/components/system/LocaleLink';
import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import { getPayloadClient } from '@/lib/payload';
import { hasTranslation } from '@/lib/cms-locale.server';
import { mediaPublicUrl, readingMinutes, wordCount, extractFaq, toBlogCard, type BlogCard } from '@/lib/blog';
import { RelatedSidebar, RelatedInline, PostNav } from './post-parts';
import { articleConverters } from './rich-text';
import {
  absoluteUrl,
  ogImageUrl,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  localeMeta,
  type PostSeo,
} from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';
import { OG_LOCALES, localizePath, type Locale } from '@/i18n/config';
import { getMessages, resolveLocale } from '@/i18n/get-messages';
import { fmt, formatDate } from '@/i18n/format';

/**
 * /blog/[slug] — a single PUBLISHED post from Payload (drafts stay private).
 * Byline is always "Saver Miles Team" (collection default; never a real name —
 * docs/plans/00). Full SEO: canonical, Open Graph (article), Twitter card, and
 * a BlogPosting JSON-LD block.
 *
 * Languages: /de/blog/<slug> shows the German post once it has a German title
 * and body. Until then it shows the whole English post (never a German title
 * over an English body), marked lang="en" with a note, and its canonical is the
 * English URL so search engines don't index an English page as German.
 */
export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ lang: string; slug: string }> };

/**
 * The post in the page's language, or in English when it has no translation
 * yet. `shown` is the language actually on the page; `hasGerman` drives the
 * hreflang. On a DB error, treat the post as not found (404) rather than a 500.
 * cache(): generateMetadata and the page share one lookup per request.
 */
const getPost = cache(async (slug: string, locale: Locale) => {
  try {
    const payload = await getPayloadClient();
    const read = async (l: Locale) =>
      (
        await payload.find({
          collection: 'posts',
          where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
          limit: 1,
          depth: 1, // populate coverImage + category + meta.image
          locale: l,
        })
      ).docs[0] ?? null;
    const post = await read(locale);
    if (!post) return null;
    const hasGerman = await hasTranslation('posts', post.id, 'de');
    if (locale === 'en' || hasGerman) return { post, shown: locale, hasGerman };
    const english = await read('en');
    return english ? { post: english, shown: 'en' as Locale, hasGerman } : null;
  } catch {
    return null;
  }
});

/**
 * The published-post pool (newest first) used to compute related posts and the
 * prev/next pager. Degrades to [] on any DB error so the article still renders.
 */
async function getPostPool(locale: Locale): Promise<BlogCard[]> {
  try {
    const payload = await getPayloadClient();
    const { docs } = await payload.find({
      collection: 'posts',
      where: { _status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 100,
      depth: 1, // populate coverImage + category
      locale, // untranslated posts fall back to English
    });
    return docs.map(toBlogCard);
  } catch {
    return [];
  }
}

/**
 * From the newest-first pool, pick up to 4 related posts (same category first,
 * then most-recent others) and the chronologically adjacent posts: `next` is the
 * newer neighbor, `prev` the older one.
 */
function postContext(pool: BlogCard[], slug: string, catSlug?: string) {
  const idx = pool.findIndex((c) => c.slug === slug);
  const next = idx > 0 ? pool[idx - 1] : null;
  const prev = idx >= 0 && idx < pool.length - 1 ? pool[idx + 1] : null;

  const rest = pool.filter((c) => c.slug !== slug);
  const sameCat = catSlug ? rest.filter((c) => c.category?.slug === catSlug) : [];
  const others = rest.filter((c) => !catSlug || c.category?.slug !== catSlug);
  const related = [...sameCat, ...others].slice(0, 4);

  return { related, prev, next };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const [locale, { slug }] = await Promise.all([resolveLocale(params), params]);
  const loaded = await getPost(slug, locale);
  if (!loaded) return { title: getMessages(locale).blog.post.notFound, robots: 'noindex' };
  const { post, shown, hasGerman } = loaded;

  // Canonical and hreflang follow the language actually shown: an untranslated
  // German URL points at the English post, and German hreflang appears only once
  // a German version exists. robots still follows the URL's own language (noindex
  // until German is live).
  const path = `/blog/${post.slug}`;
  const { alternates } = localeMeta(shown, path, { de: hasGerman });
  const { robots } = localeMeta(locale, path, { robots: { index: true, follow: true } });
  const url = absoluteUrl(localizePath(shown, path));
  const title = post.meta?.title || post.title;
  const description = post.meta?.description || post.excerpt || undefined;
  const image = ogImageUrl(post as unknown as PostSeo, shown);

  return {
    title,
    description,
    alternates,
    openGraph: {
      type: 'article',
      url,
      locale: OG_LOCALES[shown],
      title,
      description,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? post.publishedAt ?? undefined,
      authors: ['Saver Miles Team'],
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
    // Opt blog content into indexing over the site-wide default.
    robots,
  };
}

export default async function BlogPostPage({ params }: Params) {
  const [locale, { slug }] = await Promise.all([resolveLocale(params), params]);
  const [loaded, pool] = await Promise.all([getPost(slug, locale), getPostPool(locale)]);
  if (!loaded) notFound();
  const { post, shown } = loaded;
  // The article's own language; the page chrome stays in the URL's language.
  const articleLang = shown !== locale ? shown : undefined;

  const { blog } = getMessages(locale);
  const m = blog.post;
  const date = post.publishedAt
    ? formatDate(locale, post.publishedAt, { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const cover = typeof post.coverImage === 'object' && post.coverImage ? post.coverImage : null;
  const category = typeof post.category === 'object' && post.category ? post.category : null;
  const catSlug = (category as { slug?: string } | null)?.slug;
  const { related, prev, next } = postContext(pool, String(post.slug), catSlug);

  const reading = readingMinutes(post.content);
  const labels = { locale, m, minutes: blog.index.minutes };
  const faqs = extractFaq(post.content);
  const crumbs = [
    { name: blog.home, url: locale === 'en' ? SITE_URL : absoluteUrl(localizePath(locale, '/')) },
    { name: blog.title, url: absoluteUrl(localizePath(locale, '/blog')) },
    ...(category?.name && catSlug
      ? [{ name: category.name, url: absoluteUrl(localizePath(locale, `/blog/category/${catSlug}`)) }]
      : []),
    { name: post.title, url: absoluteUrl(localizePath(shown, `/blog/${post.slug}`)) },
  ];

  const jsonLd: Record<string, unknown>[] = [
    articleJsonLd(post as unknown as PostSeo, {
      wordCount: wordCount(post.content),
      section: category?.name || undefined,
      locale: shown,
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

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-20">
        <Link href="/blog" className="text-sm text-ink-sub transition-colors hover:text-ink">
          {m.allPosts}
        </Link>

        <div
          className={`mt-8 ${
            related.length > 0 ? 'lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-14' : 'mx-auto max-w-2xl'
          }`}
        >
          <article className="min-w-0 max-w-2xl" lang={articleLang}>
            {articleLang && (
              <p
                lang={locale}
                className="mb-6 rounded-lg px-3.5 py-2.5 text-sm text-ink-sub"
                style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
              >
                {m.englishOnly}
              </p>
            )}
            <header>
              <p
                lang={articleLang ? locale : undefined}
                className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent"
              >
                {category?.name ? `${category.name} · ` : ''}
                {post.author || 'Saver Miles Team'}
                {date ? ` · ${date}` : ''}
                {` · ${fmt(m.minutesRead, { n: reading })}`}
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
                <RichText data={post.content as SerializedEditorState} converters={articleConverters} />
              </div>
            )}

            <div lang={articleLang ? locale : undefined}>
              <PostNav prev={prev} next={next} m={m} />
              <RelatedInline posts={related} labels={labels} />
            </div>
          </article>

          <RelatedSidebar posts={related} labels={labels} />
        </div>
      </div>

      <Footer />
    </>
  );
}
