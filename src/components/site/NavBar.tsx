'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import Logo from './Logo';
import ModeToggle from '@/components/system/ModeToggle';

/**
 * Sticky top nav — docs/plans/04-components-spec.md.
 *
 * Transparent at the top of the page; picks up a glass backdrop-blur once
 * scrolled, consistent with the glass system (not transparent-on-white). Hosts
 * the 3-way ModeToggle and the primary "Check My Route" CTA.
 *
 * Full nav list is docs/plans/02. This first slice only needs Home, the toggle,
 * and the CTA — the other links point at routes built in later slices.
 */
const NAV = [
  { label: 'Individual', href: '/individual' },
  { label: 'Business', href: '/business' },
  { label: 'How It Works', href: '/how-it-works' },
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

        <ul className="hidden items-center gap-7 md:flex">
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
          <ModeToggle className="hidden sm:inline-flex" />
          <Link
            href="/individual"
            className="rounded-full px-4 py-2 text-sm font-medium transition-colors"
            style={{ background: 'var(--sm-cta)', color: 'var(--sm-cta-text)' }}
          >
            Check My Route
          </Link>
        </div>
      </nav>
    </header>
  );
}
