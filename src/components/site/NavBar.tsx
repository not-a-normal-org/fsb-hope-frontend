'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import Logo from './Logo';
import ModeCycle from '@/components/system/ModeCycle';

/**
 * Sticky top nav — docs/plans/04-components-spec.md.
 *
 * Transparent at the top of the page; picks up a glass backdrop-blur once
 * scrolled, consistent with the glass system (not transparent-on-white). Hosts a
 * compact ModeCycle icon (click to toggle Light ⇄ Dark; Mono is held) and the
 * single primary CTA; the fuller segmented toggle lives in the footer.
 */
// Guides + Deals removed for launch (Review v3 §8): they pointed at
// /blog/category/{guides,deals}, which 404 unless the CMS is seeded — a dead link
// on a deposit-asking site costs more than a missing section. Deals returns with
// the deals grid; Guides only if it gets real content.
const NAV = [
  { label: 'Individual', href: '/individual' },
  { label: 'Business', href: '/business' },
  { label: 'Alerts', href: '/alerts' },
  { label: 'Pricing', href: '/pricing' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-colors"
      style={
        scrolled
          ? {
              background: 'var(--sm-glass-bg)',
              borderBottom: '1px solid var(--sm-glass-border)',
              backdropFilter: 'blur(18px) saturate(150%)',
              WebkitBackdropFilter: 'blur(18px) saturate(150%)',
            }
          : { borderBottom: '1px solid transparent' }
      }
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" aria-label="Saver Miles home" className="shrink-0">
          <Logo className="text-lg" label="" />
        </Link>

        <ul className="hidden items-center gap-5 lg:gap-6 md:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-ink-sub transition-colors hover:text-ink"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ModeCycle className="hidden sm:inline-flex" />
          <Link
            href="/individual"
            className="rounded-full px-4 py-2 text-sm font-medium transition-colors sm-cta"
          >
            Get a free points audit
          </Link>
        </div>
      </nav>
    </header>
  );
}
