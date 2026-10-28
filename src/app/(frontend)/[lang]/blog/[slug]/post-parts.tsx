import Image from 'next/image';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';

import Link from '@/components/system/LocaleLink';
import type { BlogCard } from '@/lib/blog';
import type { Locale } from '@/i18n/config';
import { fmt, formatDate } from '@/i18n/format';
import type { Messages } from '@/i18n/messages/en';

type PostMessages = Messages['blog']['post'];
type Labels = { locale: Locale; m: PostMessages; minutes: string };

/**
 * Presentational extras for a single post page: a related-posts list (rendered
 * as a sticky sidebar on desktop and an inline block on mobile) and the
 * prev/next pager at the foot of the article. Server components — plain links,
 * no client state. The data (which posts are related, which are adjacent) is
 * computed by the page from the published-post pool.
 */

/** A compact horizontal card used inside the related list. */
function RelatedItem({ post, labels }: { post: BlogCard; labels: Labels }) {
  const date = post.publishedAt ? formatDate(labels.locale, post.publishedAt) : null;
  return (
    <Link href={`/blog/${post.slug}`} className="group flex gap-3.5 focus:outline-none">
      <div
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl"
        style={{ background: 'var(--sm-bg-gradient)', border: '1px solid var(--sm-glass-border)' }}
      >
        {post.cover ? (
          <Image
            src={post.cover.url}
            alt={post.cover.alt}
            fill
            sizes="64px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center font-display text-[0.6rem] font-bold text-ink-muted opacity-60">
            {post.category?.name ?? 'Saver Miles'}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        {post.category && (
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-accent">
            {post.category.name}
          </p>
        )}
        <h4 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
          {post.title}
        </h4>
        <p className="mt-1 flex items-center gap-1 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-ink-muted">
          {date && <span>{date}</span>}
          {date && <span aria-hidden>·</span>}
          <Clock className="h-3 w-3" aria-hidden />
          {fmt(labels.minutes, { n: post.readingMinutes })}
        </p>
      </div>
    </Link>
  );
}

/** The related list body, shared by the sidebar and the mobile block. */
function RelatedList({ posts, labels }: { posts: BlogCard[]; labels: Labels }) {
  return (
    <>
      <h2 className="font-mono text-eyebrow uppercase tracking-[0.14em] text-ink-muted">
        {labels.m.related}
      </h2>
      <div className="mt-5 flex flex-col gap-5">
        {posts.map((p) => (
          <RelatedItem key={p.id} post={p} labels={labels} />
        ))}
      </div>
    </>
  );
}

/** Sticky sidebar variant (desktop only). */
export function RelatedSidebar({ posts, labels }: { posts: BlogCard[]; labels: Labels }) {
  if (posts.length === 0) return null;
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <RelatedList posts={posts} labels={labels} />
      </div>
    </aside>
  );
}

/** Inline variant shown below the article on mobile/tablet, where no sidebar fits. */
export function RelatedInline({ posts, labels }: { posts: BlogCard[]; labels: Labels }) {
  if (posts.length === 0) return null;
  return (
    <section
      className="mt-14 border-t pt-10 lg:hidden"
      style={{ borderColor: 'var(--sm-glass-border)' }}
    >
      <RelatedList posts={posts} labels={labels} />
    </section>
  );
}

/** Older/newer pager at the foot of the article. */
export function PostNav({
  prev,
  next,
  m,
}: {
  prev: BlogCard | null;
  next: BlogCard | null;
  m: PostMessages;
}) {
  if (!prev && !next) return null;
  return (
    <nav
      aria-label={m.pager}
      className="mt-16 grid gap-4 border-t pt-8 sm:grid-cols-2"
      style={{ borderColor: 'var(--sm-glass-border)' }}
    >
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group flex flex-col gap-1.5 rounded-2xl p-5 transition-colors"
          style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
        >
          <span className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-muted">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {m.previous}
          </span>
          <span className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex flex-col gap-1.5 rounded-2xl p-5 transition-colors sm:items-end sm:text-right"
          style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
        >
          <span className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-muted">
            {m.next}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
          <span className="line-clamp-2 text-sm font-semibold leading-snug text-ink transition-colors group-hover:text-accent">
            {next.title}
          </span>
        </Link>
      ) : (
        <span aria-hidden />
      )}
    </nav>
  );
}
