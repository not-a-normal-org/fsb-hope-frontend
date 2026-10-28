'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Clock, ArrowUpRight } from 'lucide-react';

import Link from '@/components/system/LocaleLink';
import AmbientBackground from '@/components/system/AmbientBackground';
import { entrance } from '@/lib/animations';
import type { BlogCard } from '@/lib/blog';
import { fmt, formatDate, plural } from '@/i18n/format';
import { useI18n } from '@/i18n/LocaleProvider';
import type { Messages } from '@/i18n/messages/en';

type IndexMessages = Messages['blog']['index'];

/**
 * Client blog grid — modern searchable card layout over the glass system.
 * Search + category filtering run client-side over the posts the server page
 * already loaded (fast, no round-trips). When nothing is filtered and there are
 * enough posts, the newest is promoted to a wide featured card.
 */
export default function BlogIndex({
  posts,
  m,
  hideFilters = false,
}: {
  posts: BlogCard[];
  m: IndexMessages;
  /** Hide the category pills — used on category pages, where the set is fixed. */
  hideFilters?: boolean;
}) {
  const { locale } = useI18n();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    for (const p of posts) if (p.category) seen.set(p.category.slug, p.category.name);
    return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
  }, [posts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const inCategory = !category || p.category?.slug === category;
      const inQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt ?? '').toLowerCase().includes(q) ||
        (p.category?.name ?? '').toLowerCase().includes(q);
      return inCategory && inQuery;
    });
  }, [posts, query, category]);

  const isFiltering = query.trim() !== '' || category !== null;
  const featured = !isFiltering && filtered.length > 2 ? filtered[0] : null;
  const gridPosts = featured ? filtered.slice(1) : filtered;

  const clear = () => {
    setQuery('');
    setCategory(null);
  };

  return (
    <section className="relative">
      <AmbientBackground variant="section" />
      <div className="mx-auto max-w-6xl px-6 pb-24">
        {posts.length > 0 && (
          <div
            className="flex flex-col gap-4 border-b pb-6 md:flex-row md:items-center md:justify-between"
            style={{ borderColor: 'var(--sm-glass-border)' }}
          >
            <SearchBar value={query} onChange={setQuery} m={m} />
            {!hideFilters && categories.length > 0 && (
              <CategoryPills categories={categories} active={category} onSelect={setCategory} all={m.all} />
            )}
          </div>
        )}

        {posts.length === 0 ? (
          <Empty message={m.empty} />
        ) : filtered.length === 0 ? (
          <Empty
            message={query.trim() ? fmt(m.noMatch, { query: query.trim() }) : m.noneInCategory}
            onClear={clear}
            clearLabel={m.clear}
          />
        ) : (
          <>
            {featured && <FeaturedCard post={featured} m={m} />}

            {isFiltering && (
              <p className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-muted">
                {plural(locale, filtered.length, m.results)}
              </p>
            )}

            <motion.div
              variants={entrance}
              initial="hidden"
              animate="visible"
              className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${
                isFiltering ? 'mt-4' : 'mt-8'
              }`}
            >
              {gridPosts.map((post) => (
                <PostCard key={post.id} post={post} m={m} />
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

function SearchBar({
  value,
  onChange,
  m,
}: {
  value: string;
  onChange: (v: string) => void;
  m: IndexMessages;
}) {
  return (
    <div className="relative w-full md:max-w-xs">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={m.searchPlaceholder}
        aria-label={m.searchLabel}
        className="w-full rounded-full py-2.5 pl-10 pr-4 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:ring-2 focus:ring-accent"
        style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
      />
    </div>
  );
}

function CategoryPills({
  categories,
  active,
  onSelect,
  all,
}: {
  categories: { slug: string; name: string }[];
  active: string | null;
  onSelect: (slug: string | null) => void;
  all: string;
}) {
  const pills: { slug: string | null; name: string }[] = [{ slug: null, name: all }, ...categories];
  return (
    <div className="flex flex-wrap gap-2">
      {pills.map((pill) => {
        const on = active === pill.slug;
        return (
          <button
            key={pill.slug ?? 'all'}
            type="button"
            onClick={() => onSelect(pill.slug)}
            aria-pressed={on}
            className="rounded-full px-4 py-1.5 text-xs font-medium transition-colors"
            style={
              on
                ? { background: 'var(--sm-cta)', color: 'var(--sm-cta-text)', border: '1px solid transparent' }
                : { background: 'transparent', color: 'var(--sm-ink-sub)', border: '1px solid var(--sm-glass-border)' }
            }
          >
            {pill.name}
          </button>
        );
      })}
    </div>
  );
}

function CoverPlaceholder({ label }: { label?: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: 'var(--sm-bg-gradient)' }}
    >
      <div
        className="absolute -right-8 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
        style={{ background: 'var(--sm-glass-bg)' }}
      />
      <span className="font-display text-lg font-bold tracking-tight text-ink-muted opacity-50">
        {label ?? 'Saver Miles'}
      </span>
    </div>
  );
}

function Meta({ post, m, longform = false }: { post: BlogCard; m: IndexMessages; longform?: boolean }) {
  const { locale } = useI18n();
  const date = post.publishedAt ? formatDate(locale, post.publishedAt) : null;
  return (
    <div className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
      {date && <span>{date}</span>}
      {date && <span aria-hidden>·</span>}
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3 w-3" aria-hidden />
        {fmt(longform ? m.minutesRead : m.minutes, { n: post.readingMinutes })}
      </span>
    </div>
  );
}

function FeaturedCard({ post, m }: { post: BlogCard; m: IndexMessages }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group mt-8 block focus:outline-none">
      <article
        className="grid overflow-hidden rounded-3xl transition-all duration-200 group-hover:-translate-y-1 group-focus-visible:-translate-y-1 md:grid-cols-2"
        style={{
          background: 'var(--sm-glass-bg)',
          border: '1px solid var(--sm-glass-border)',
          boxShadow: 'var(--sm-glass-shadow)',
        }}
      >
        <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto md:min-h-[340px]">
          {post.cover ? (
            <Image
              src={post.cover.wideUrl}
              alt={post.cover.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <CoverPlaceholder label={post.category?.name} />
          )}
        </div>
        <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
          <div className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.14em]">
            <span
              className="rounded-full px-2.5 py-1 sm-cta"
            >
              {m.latest}
            </span>
            {post.category && <span className="text-accent">{post.category.name}</span>}
          </div>
          <h2 className="font-display text-2xl font-bold leading-tight text-ink transition-colors group-hover:text-accent md:text-3xl">
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="line-clamp-3 text-[15px] leading-relaxed text-ink-sub">{post.excerpt}</p>
          )}
          <Meta post={post} m={m} longform />
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            {m.readPost}
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </div>
      </article>
    </Link>
  );
}

function PostCard({ post, m }: { post: BlogCard; m: IndexMessages }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full focus:outline-none">
      <article
        className="flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-200 group-hover:-translate-y-1 group-focus-visible:-translate-y-1"
        style={{
          background: 'var(--sm-glass-bg)',
          border: '1px solid var(--sm-glass-border)',
          boxShadow: 'var(--sm-glass-shadow)',
        }}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {post.cover ? (
            <Image
              src={post.cover.url}
              alt={post.cover.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <CoverPlaceholder label={post.category?.name} />
          )}
          {post.category && (
            <span
              className="absolute left-3 top-3 rounded-full px-2.5 py-1 font-mono text-[0.6rem] uppercase tracking-[0.12em] backdrop-blur"
              style={{
                background: 'color-mix(in srgb, var(--sm-bg-base) 70%, transparent)',
                color: 'var(--sm-accent)',
                border: '1px solid var(--sm-glass-border)',
              }}
            >
              {post.category.name}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-sub">{post.excerpt}</p>
          )}
          <div className="mt-auto pt-4">
            <Meta post={post} m={m} />
          </div>
        </div>
      </article>
    </Link>
  );
}

function Empty({
  message,
  onClear,
  clearLabel,
}: {
  message: string;
  onClear?: () => void;
  clearLabel?: string;
}) {
  return (
    <div
      className="mt-10 flex flex-col items-center gap-4 rounded-2xl px-6 py-16 text-center"
      style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
    >
      <p className="max-w-sm text-sm leading-relaxed text-ink-sub">{message}</p>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-accent underline-offset-4 hover:underline"
        >
          {clearLabel}
        </button>
      )}
    </div>
  );
}
