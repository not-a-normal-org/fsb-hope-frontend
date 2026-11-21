'use client';

import { useEffect } from 'react';

import { CONSENT_EVENT, readConsent } from '@/lib/consent';

/**
 * Microsoft Clarity (heatmaps + session replay), loaded only after the visitor
 * has accepted analytics in the ConsentBanner.
 *
 * Why this doesn't look like the Google tag in DocumentShell. The Google tag ships
 * on every public page and relies on Consent Mode, with defaults that differ by
 * region (opt-out outside the EEA/UK/CH, see src/lib/consent.ts). Clarity records
 * interactions rather than counting them, so it stays opt-in everywhere: nothing
 * is loaded at all until the visitor clicks Accept. Before that there is no
 * Clarity request, no cookie, and no recording — the strictest reading of the
 * EU/UK rules, which Clarity itself has enforced for EEA/UK/CH traffic since
 * 2025-10-31.
 *
 * Rendered by the public layout, not DocumentShell: the staff root layout shares
 * that shell, and session replay must never run over /admin or /cms, where lead
 * and customer records are on screen.
 *
 * `consentv2` is Clarity's current consent call (`consent` is deprecated). We
 * grant analytics storage only — ad storage stays denied, because Clarity plays
 * no part in advertising (Google Ads is the only ad tool, see src/lib/ads.ts).
 * Withdrawal uses `clarity('consent', false)`, the documented way to erase
 * Clarity's cookies and end the session; the tag itself cannot be unloaded
 * mid-session.
 */
const PROJECT_ID = 'z80885zxms';

declare global {
  interface Window {
    clarity?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

/** Inject the tag once. Mirrors Microsoft's snippet, minus the `?ref=bwt` param. */
function loadClarity(): void {
  if (window.clarity || document.getElementById('ms-clarity')) return;
  const w = window as Window & { clarity?: { q?: unknown[] } };
  w.clarity =
    w.clarity ||
    function (...args: unknown[]) {
      (w.clarity!.q = w.clarity!.q || []).push(args);
    };
  const tag = document.createElement('script');
  tag.id = 'ms-clarity';
  tag.async = true;
  tag.src = `https://www.clarity.ms/tag/${PROJECT_ID}`;
  document.head.appendChild(tag);
}

/** Tell Clarity what was decided. Queued by the stub if the tag is still loading. */
function sendConsent(granted: boolean): void {
  if (granted) {
    window.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
  } else {
    // Erases Clarity's cookies and restarts in no-consent mode.
    window.clarity?.('consent', false);
  }
}

export default function ClarityScript() {
  useEffect(() => {
    const apply = (granted: boolean) => {
      if (granted) {
        loadClarity();
        sendConsent(true);
      } else if (window.clarity) {
        // Only meaningful if they accepted earlier in the session and changed
        // their mind; with no tag loaded there is nothing to revoke.
        sendConsent(false);
      }
    };

    // Only an explicit Accept loads Clarity; no choice (or blocked storage) does not.
    if (readConsent() === 'granted') apply(true);

    // The banner fires this on Accept/Decline so the choice takes effect without
    // a reload, in either direction.
    const onChange = (event: Event) => apply((event as CustomEvent<boolean>).detail === true);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return null;
}
