import type { ReactNode } from 'react';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';

/**
 * Shared shell for the long-form legal pages (/legal/terms, /legal/privacy,
 * /legal/cookies). Compact hero + a readable prose column. The body is authored
 * as plain h2/h3/p/ul JSX and styled by `.sm-prose` (the same rules the blog
 * RichText uses), so the three documents stay visually consistent.
 */
export default function LegalDoc({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <>
      <NavBar />
      <PageHero compact eyebrow="Legal" title={title} intro={intro} />
      <section className="relative">
        <div className="mx-auto max-w-3xl px-6 pb-24">
          <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted">
            Last updated: {updated}
          </p>
          <div className="sm-prose mt-8 text-ink-sub">{children}</div>
        </div>
      </section>
      <Footer />
    </>
  );
}
