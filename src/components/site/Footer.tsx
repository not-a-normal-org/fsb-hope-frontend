import Link from 'next/link';

import Logo from './Logo';
import ModeToggle from '@/components/system/ModeToggle';

/**
 * Footer — docs/plans/02-site-structure.md. Sitemap links, legal, and the mode
 * switch repeated. Deliberately thin for this slice; the newsletter band lands
 * in a later slice.
 *
 * No founder names, no prior company, no region/legal-entity line (non-
 * negotiables in docs/plans/00-context.md). Blog byline elsewhere is always
 * "Saver Miles Team."
 */
const COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Individual', href: '/individual' },
      { label: 'Business', href: '/business' },
      { label: 'Alerts', href: '/alerts' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Calculator', href: '/calculator' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'How It Works', href: '/how-it-works' },
      { label: 'About', href: '/about' },
      { label: 'Results', href: '/results' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy', href: '/legal/privacy' },
      { label: 'Terms', href: '/legal/terms' },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--sm-glass-border)' }}>
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Logo className="text-xl" />
            <p className="mt-5 text-sm leading-relaxed text-ink-sub">
              Real award seats, found by hand across 30+ loyalty programs — not
              the ghost availability automated tools show.
            </p>
            <div className="mt-6">
              <ModeToggle />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
                  {col.heading}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-sub transition-colors hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <p className="mt-12 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
          © {new Date().getFullYear()} Saver Miles
        </p>
      </div>
    </footer>
  );
}
