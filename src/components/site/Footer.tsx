import Link from 'next/link';

import Logo from './Logo';
import NewsletterForm from './NewsletterForm';
import ModeToggle from '@/components/system/ModeToggle';

/**
 * Footer — docs/plans/02-site-structure.md. Sitemap links, legal, a compact
 * newsletter signup, and the mode switch repeated.
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
      { label: 'Blog', href: '/blog' },
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
              Award travel is broken. We assign you a specialist who fixes it,
              working 30+ loyalty programs to get you a seat worth flying.
            </p>
            <div className="mt-6">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
                Points intel, occasionally
              </p>
              <div className="mt-3">
                <NewsletterForm source="footer" buttonLabel="Join" compact />
              </div>
            </div>
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
