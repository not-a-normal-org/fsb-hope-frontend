import type { ComponentType, ReactNode } from 'react';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import { LOCALE_TAGS, type Locale } from '@/i18n/config';

/**
 * One language's version of a legal document. Each document keeps a
 * `content.<locale>.tsx` per language, and its `page.tsx` picks one by locale.
 * The legal text lives there, not in the message dictionaries, because it is
 * long-form prose with its own structure.
 */
export type LegalContent = {
  title: string;
  description: string;
  intro: string;
  Body: ComponentType;
};

// The page chrome around the document, per language.
const CHROME: Record<Locale, { eyebrow: string; updated: string }> = {
  en: { eyebrow: 'Legal', updated: 'Last updated' },
  de: { eyebrow: 'Rechtliches', updated: 'Zuletzt aktualisiert' },
};

// `updated` is an ISO date (YYYY-MM-DD). Formatted in UTC so the day can't
// shift with the server's time zone.
function formatUpdated(locale: Locale, iso: string): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

/**
 * Shared shell for the long-form legal pages (/legal/terms, /legal/privacy,
 * /legal/cookies). Compact hero + a readable prose column. The body is authored
 * as plain h2/h3/p/ul JSX and styled by `.sm-prose` (the same rules the blog
 * RichText uses), so the three documents stay visually consistent.
 */
export default function LegalDoc({
  locale,
  title,
  updated,
  intro,
  children,
}: {
  locale: Locale;
  title: string;
  updated: string;
  intro?: string;
  children: ReactNode;
}) {
  const chrome = CHROME[locale];
  return (
    <>
      <NavBar />
      <PageHero compact eyebrow={chrome.eyebrow} title={title} intro={intro} />
      <section className="relative">
        <div className="mx-auto max-w-3xl px-6 pb-24">
          <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-muted">
            {chrome.updated}: {formatUpdated(locale, updated)}
          </p>
          <div className="sm-prose mt-8 text-ink-sub">{children}</div>
        </div>
      </section>
      <Footer />
    </>
  );
}
