'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

import Logo from './Logo';
import MobileMenu from './MobileMenu';
import ModeCycle from '@/components/system/ModeCycle';
import { PRIMARY_NAV } from '@/lib/nav';

/**
 * Sticky top nav — docs/plans/04-components-spec.md.
 *
 * Transparent at the top of the page; picks up a glass backdrop-blur once
 * scrolled, consistent with the glass system (not transparent-on-white). Hosts a
 * compact ModeCycle icon (click to toggle Light ⇄ Dark; Mono is held) and the
 * single primary CTA; the fuller segmented toggle lives in the footer.
 *
 * The link row is desktop-only. Below `md` a menu button opens {@link MobileMenu},
 * which carries the full public sitemap plus the theme control — before it existed
 * the footer was the only way to reach a second page on a phone.
 */
export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
          {PRIMARY_NAV.map((item) => (
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

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Below md the theme control lives in the mobile menu instead, which
              keeps the bar from crowding on a narrow phone. */}
          <ModeCycle className="hidden md:inline-flex" />
          <Link
            href="/audit"
            className="shrink-0 rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4 sm-cta"
          >
            {/* The full label plus a menu button overflows a 320px bar. */}
            <span className="sm:hidden">Free audit</span>
            <span className="hidden sm:inline">Get a free points audit</span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="sm-icon-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:hidden"
          >
            <Menu className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
      </nav>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
