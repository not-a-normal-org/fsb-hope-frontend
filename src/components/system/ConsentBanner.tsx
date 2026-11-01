'use client';

import { useEffect, useState } from 'react';
import Link from '@/components/system/LocaleLink';
import { useI18n } from '@/i18n/LocaleProvider';
import { rich } from '@/i18n/rich';

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
  const { m } = useI18n();
  // Starts visible, so it is in the server HTML and a first-time visitor sees it
  // with the first paint; mounted after hydration instead, its paragraph was the
  // home page's LCP, 2–4 s late. A returning visitor never sees it: ConsentScript
  // marks <html data-consent> before paint, CSS hides `.sm-consent`, and the
  // effect below unmounts it.
  const [visible, setVisible] = useState(true);

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
    if (stored === 'granted' || stored === 'denied') setVisible(false);

    // Let the Footer (and anything else) re-open the banner to change the choice.
    const open = () => {
      // Lift the pre-paint hide, or the reopened banner would stay display:none.
      delete document.documentElement.dataset.consent;
      setVisible(true);
    };
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
      aria-label={m.consent.dialog}
      className="sm-consent fixed inset-x-0 bottom-0 z-[70] flex justify-center p-4 sm:p-6"
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
              {m.consent.eyebrow}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-sub">
              {rich(m.consent.body, {
                link: (chunks) => (
                  <Link href="/legal/cookies" className="text-accent transition-colors hover:text-ink">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={() => decide(false)}
              className="sm-cta-ghost rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              {m.consent.decline}
            </button>
            <button
              type="button"
              onClick={() => decide(true)}
              className="sm-cta rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              {m.consent.accept}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
