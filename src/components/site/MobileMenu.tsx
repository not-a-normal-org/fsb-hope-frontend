'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

import Logo from './Logo';
import ModeToggle from '@/components/system/ModeToggle';
import { DURATION, EASE_OUT } from '@/lib/animations';
import { useOverlayChrome } from '@/lib/use-overlay-chrome';
import { MOBILE_NAV_GROUPS } from '@/lib/nav';

/**
 * The site menu below `md`, where NavBar hides its link row.
 *
 * Until this existed there was no way to reach a second page on a phone short
 * of scrolling to the footer, so the menu carries the whole public sitemap
 * (src/lib/nav.ts) rather than mirroring the seven-item desktop bar.
 *
 * Chrome (portal, scroll lock, focus trap, Esc, focus restore) is the shared
 * useOverlayChrome, same as LeadModal. The panel is `--sm-bg-elevated` over a
 * scrim rather than a GlassPanel: glass only reads as glass over something
 * blurred, and a scrim is not that.
 */

/** Never-changing subscription for the mount gate — the store value is constant. */
const subscribeNoop = () => () => {};

const ALL_LINKS = MOBILE_NAV_GROUPS.flatMap((g) => g.links);

/**
 * Longest-prefix match, the same rule AdminShell uses for its sidebar. Sorting
 * by href length first is what stops /blog claiming the highlight on
 * /blog/category/guides, while still letting it claim /blog/some-post.
 */
function activeHref(pathname: string): string | undefined {
  return [...ALL_LINKS]
    .sort((a, b) => b.href.length - a.href.length)
    .find((l) => pathname === l.href || pathname.startsWith(l.href + '/'))?.href;
}

export default function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() ?? '';
  const lastPath = useRef(pathname);

  const close = useCallback(() => onClose(), [onClose]);

  // Focus lands on the close button: it's the first control, and it tells a
  // screen-reader user how to get out before reading thirteen links.
  useOverlayChrome({ open, onClose: close, containerRef: panelRef, initialFocusRef: closeRef });

  // Each link closes on click, but a route can also change from under us — the
  // back button, or a link inside the panel that a click handler missed. Closing
  // on pathname change is the safety net, ignoring the initial render.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    close();
  }, [pathname, close]);

  // The panel is md:hidden, so resizing or rotating past md would hide it while
  // the scroll lock stayed applied — an unscrollable page with no way back.
  // Close instead.
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia('(min-width: 768px)');
    if (mq.matches) {
      close();
      return;
    }
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) close();
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [open, close]);

  // Client-mount gate for the portal — false during SSR (no document), true once
  // hydrated. useSyncExternalStore avoids a setState-in-effect.
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  if (!mounted) return null;

  const current = activeHref(pathname);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          // Above NavBar (z-50) and the consent banner (z-[70]); below LeadModal.
          className="fixed inset-0 z-[80] md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.hover, ease: EASE_OUT }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(3, 6, 12, 0.62)', backdropFilter: 'blur(6px)' }}
            // onMouseDown, not onClick: a drag that began inside the panel and
            // ended on the scrim shouldn't dismiss it.
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          />

          <motion.div
            ref={panelRef}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute inset-y-0 right-0 flex w-[min(88vw,22rem)] flex-col"
            style={{
              background: 'var(--sm-bg-elevated)',
              borderLeft: '1px solid var(--sm-glass-border)',
              boxShadow: 'var(--sm-glass-shadow)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: DURATION.entrance, ease: EASE_OUT }}
          >
            <div
              className="flex shrink-0 items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid var(--sm-glass-border)' }}
            >
              <Link href="/" onClick={close} aria-label="Saver Miles home">
                <Logo className="text-base" label="" />
              </Link>
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="sm-icon-btn inline-flex h-9 w-9 items-center justify-center rounded-full"
              >
                <X className="h-[18px] w-[18px]" aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {MOBILE_NAV_GROUPS.map((group) => (
                <nav key={group.heading} aria-label={group.heading} className="mb-7 last:mb-0">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
                    {group.heading}
                  </p>
                  <ul className="mt-2">
                    {group.links.map((link) => {
                      const isActive = link.href === current;
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={close}
                            aria-current={isActive ? 'page' : undefined}
                            // py-3 keeps the tap target at ~48px. The current page
                            // is marked by weight and an accent rail rather than
                            // accent text: --sm-accent on --sm-bg-elevated is only
                            // 4.45:1 in Light, just shy of AA, while ink clears it
                            // in every theme.
                            className={`block border-l-2 py-3 pl-3 text-base transition-colors ${
                              isActive
                                ? 'border-accent font-medium text-ink'
                                : 'border-transparent text-ink-sub hover:text-ink'
                            }`}
                          >
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              ))}
            </div>

            <div
              className="shrink-0 px-6 pt-5"
              style={{
                borderTop: '1px solid var(--sm-glass-border)',
                // Clears the iOS home indicator.
                paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))',
              }}
            >
              <Link
                href="/audit"
                onClick={close}
                className="sm-cta block rounded-full px-4 py-3 text-center text-sm font-medium"
              >
                Get a free points audit
              </Link>
              <div className="mt-4 flex items-center justify-between">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
                  Theme
                </p>
                <ModeToggle />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
