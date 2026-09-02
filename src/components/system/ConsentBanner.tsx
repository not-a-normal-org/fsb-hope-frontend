'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

/**
 * Cookie-consent banner, wired to Google Consent Mode v2. Analytics start denied
 * (set pre-paint in the layout's consent-default script); this banner is how the
 * visitor grants or refuses, and it flips `analytics_storage` accordingly.
 *
 * Styled with the design system (`--sm-*` tokens + `.sm-cta` / `.sm-cta-ghost`), so
 * it reads correctly in Dark, Light, and Mono and respects reduced motion via the
 * global CSS rules. The choice persists in localStorage; a returning visitor who
 * accepted has analytics re-granted in the layout script, so the banner stays hidden.
 *
 * Re-openable for withdrawal (a GDPR requirement): the Footer's "Cookie preferences"
 * control calls `window.smOpenConsent()`, which this component registers on mount.
 */
const STORAGE_KEY = 'sm-consent'; // 'granted' | 'denied'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    smOpenConsent?: () => void;
  }
}

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* private mode / storage blocked — show the banner and don't persist */
    }
    // Reading persisted consent is a client-only external-system sync (localStorage
    // is unavailable during SSR), so the mount-time setState is intentional here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored !== 'granted' && stored !== 'denied') setVisible(true);

    // Let the Footer (and anything else) re-open the banner to change the choice.
    const open = () => setVisible(true);
    window.smOpenConsent = open;
    return () => {
      if (window.smOpenConsent === open) delete window.smOpenConsent;
    };
  }, []);

  const decide = (granted: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, granted ? 'granted' : 'denied');
    } catch {
      /* ignore */
    }
    window.gtag?.('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[70] flex justify-center p-4 sm:p-6"
    >
      <div
        className="w-full max-w-2xl rounded-2xl p-5 shadow-2xl backdrop-blur-md sm:p-6"
        style={{
          background: 'var(--sm-bg-elevated)',
          border: '1px solid var(--sm-glass-border)',
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
              Cookies
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-sub">
              We use essential cookies to run the site and Google Analytics to measure aggregate
              traffic so we can improve it. No advertising, ever. See our{' '}
              <Link href="/legal/cookies" className="text-accent transition-colors hover:text-ink">
                Cookie Policy
              </Link>
              .
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={() => decide(false)}
              className="sm-cta-ghost rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => decide(true)}
              className="sm-cta rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
