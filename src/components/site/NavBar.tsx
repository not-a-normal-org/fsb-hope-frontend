'use client';

import { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

import Logo from './Logo';
import LeadModal from './LeadModal';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from '@/components/system/LanguageSwitcher';
import Link from '@/components/system/LocaleLink';
import ModeCycle from '@/components/system/ModeCycle';
import { useI18n } from '@/i18n/LocaleProvider';
import { PRIMARY_NAV } from '@/lib/nav';

/**
 * Sticky top nav — docs/plans/04-components-spec.md.
 *
 * Transparent at the top of the page; picks up a glass backdrop-blur once
 * scrolled, consistent with the glass system (not transparent-on-white). Hosts a
 * compact ModeCycle icon (click to toggle Light ⇄ Dark; Mono is held) and the
 * single primary CTA; the fuller segmented toggle lives in the footer.
 *
 * "Get started" opens the lead popup on whatever page the visitor is on; with no
 * `type` the popup asks "individual or business?" first. The popup is owned here
 * rather than by the button so the mobile menu's copy of the CTA can open it too
 * — the menu unmounts as it closes, and would take its own popup with it.
 *
 * The link row is desktop-only. Below `md` a menu button opens {@link MobileMenu},
 * which carries the full public sitemap plus the theme control — before it existed
 * the footer was the only way to reach a second page on a phone.
 *
 * The language switch joins the cluster only from `lg`: at `md` the seven-link
 * row already uses the width, so between md and lg it lives in the footer.
 */
export default function NavBar() {
  const { m } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);

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
        {/* The logo's alt names the link ("Saver Miles home"), rather than an
            aria-label over an empty alt that audits report as a missing alt. */}
        <Link href="/" className="shrink-0">
          <Logo className="text-lg" label={m.nav.home} />
        </Link>

        <ul className="hidden items-center gap-5 lg:gap-6 md:flex">
          {PRIMARY_NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-ink-sub transition-colors hover:text-ink"
              >
                {m.links[item.key]}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Below md the theme control lives in the mobile menu instead, which
              keeps the bar from crowding on a narrow phone. */}
          <LanguageSwitcher variant="compact" className="hidden lg:inline-flex" />
          <ModeCycle className="hidden md:inline-flex" />
          {/* Kept to two words: a longer label plus the menu button overflows a
              320px bar. */}
          <button
            type="button"
            onClick={() => setLeadOpen(true)}
            aria-haspopup="dialog"
            className="shrink-0 cursor-pointer rounded-full px-3 py-2 text-sm font-medium transition-colors sm:px-4 sm-cta"
          >
            {m.nav.getStarted}
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={m.nav.menu}
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            className="sm-icon-btn inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:hidden"
          >
            <Menu className="h-[18px] w-[18px]" aria-hidden />
          </button>
        </div>
      </nav>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onGetStarted={() => {
          setMenuOpen(false);
          setLeadOpen(true);
        }}
      />
      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />
    </header>
  );
}
