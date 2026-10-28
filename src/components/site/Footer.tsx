'use client';

import Logo from './Logo';
import NewsletterForm from './NewsletterForm';
import CookiePreferencesButton from '@/components/system/CookiePreferencesButton';
import LanguageSwitcher from '@/components/system/LanguageSwitcher';
import Link from '@/components/system/LocaleLink';
import ModeToggle from '@/components/system/ModeToggle';
import { fmt } from '@/i18n/format';
import { useI18n } from '@/i18n/LocaleProvider';
import type { NavGroup } from '@/lib/nav';

/**
 * Footer — docs/plans/02-site-structure.md. Sitemap links, legal, a compact
 * newsletter signup, and the mode switch repeated.
 *
 * No founder names, no prior company, no region/legal-entity line (non-
 * negotiables in docs/plans/00-context.md). Blog byline elsewhere is always
 * "Saver Miles Team."
 *
 * A client component only so it can read the page's language from LocaleProvider
 * (every page renders it, and a server footer would need the locale threaded
 * through each one). It holds no state.
 */
const COLUMNS: NavGroup[] = [
  {
    heading: 'product',
    links: [
      { key: 'individual', href: '/individual' },
      { key: 'business', href: '/business' },
      { key: 'alerts', href: '/alerts' },
      { key: 'pricing', href: '/pricing' },
      { key: 'calculator', href: '/calculator' },
    ],
  },
  {
    heading: 'company',
    links: [
      { key: 'howItWorks', href: '/how-it-works' },
      { key: 'about', href: '/about' },
      { key: 'blog', href: '/blog' },
      { key: 'results', href: '/results' },
      { key: 'contact', href: '/contact' },
    ],
  },
  {
    heading: 'legal',
    links: [
      { key: 'privacy', href: '/legal/privacy' },
      { key: 'terms', href: '/legal/terms' },
      { key: 'cookies', href: '/legal/cookies' },
    ],
  },
];

export default function Footer() {
  const { m } = useI18n();
  return (
    <footer style={{ borderTop: '1px solid var(--sm-glass-border)' }}>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo className="text-xl" />
            <p className="mt-5 text-sm leading-relaxed text-ink-sub">
              {m.footer.blurb}
            </p>
            <div className="mt-6">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
                {m.footer.newsletterHeading}
              </p>
              <div className="mt-3">
                <NewsletterForm source="footer" buttonLabel={m.footer.newsletterButton} compact />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ModeToggle />
              <LanguageSwitcher />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={m.navGroups[col.heading]}>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
                  {m.navGroups[col.heading]}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-sub transition-colors hover:text-ink"
                      >
                        {m.links[link.key]}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
            {fmt(m.footer.copyright, { year: new Date().getFullYear() })}
          </p>
          <CookiePreferencesButton />
        </div>
      </div>
    </footer>
  );
}
