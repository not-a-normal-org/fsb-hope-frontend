import type { Metadata } from 'next';
import Link from 'next/link';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import NoticeSection from '@/components/site/NoticeSection';
import { getPayloadClient } from '@/lib/payload';

/**
 * /blog — index of published posts from the Payload `posts` collection
 * (docs/plans/02, 06). Dynamic: queries the CMS at request time so the build
 * doesn't need the database.
 *
 * TODO (pre-launch): filter to `publishedAt <= now` for the public. Behind the
 * construction wall it's fine to show everything so authors can preview drafts.
 */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog',
};

function formatDate(value?: string | null): string | null {
  if (!value) return null;
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function BlogIndex() {
  const payload = await getPayloadClient();
  const { docs: posts } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit: 50,
    depth: 0,
  });

  return (
    <>
      <NavBar />
      <PageHero
        eyebrow="Blog"
        title="Notes on points, seats, and doing it by hand."
        intro="Field notes from searching award space the manual way — what the tools miss, and how to actually use the points you have."
      />

      {posts.length === 0 ? (
        <NoticeSection
          heading="No posts yet"
          body="We’re just getting started. Check back soon."
          cta={{ label: 'Check your route', href: '/individual' }}
        />
      ) : (
        <section className="relative">
          <div className="mx-auto max-w-3xl px-6 pb-24">
            <ul className="divide-y" style={{ borderColor: 'var(--sm-glass-border)' }}>
              {posts.map((post) => {
                const date = formatDate(post.publishedAt as string | undefined);
                return (
                  <li key={post.id} className="py-8 first:pt-0" style={{ borderColor: 'var(--sm-glass-border)' }}>
                    <Link href={`/blog/${post.slug}`} className="group block">
                      {date && (
                        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
                          {date}
                        </p>
                      )}
                      <h2 className="mt-2 font-display text-card font-bold text-ink transition-colors group-hover:text-accent">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="mt-2 text-sm leading-relaxed text-ink-sub">{post.excerpt}</p>
                      )}
                      <span className="mt-3 inline-block text-sm text-accent">Read →</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
