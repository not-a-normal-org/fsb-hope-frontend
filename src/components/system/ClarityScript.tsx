'use client';

import { useEffect } from 'react';

/**
 * Microsoft Clarity (heatmaps + session replay), loaded only after the visitor
 * has accepted analytics in the ConsentBanner.
 *
 * Why this doesn't look like the GA4 setup in DocumentShell. GA ships on every
 * page and relies on Consent Mode to stay cookieless until consent; Clarity
 * records interactions rather than counting them, so nothing is loaded at all
 * until consent is granted. Before "Accept" there is no Clarity request, no
 * cookie, and no recording — the strictest reading of the EU/UK rules, which
 * Clarity itself has enforced for EEA/UK/CH traffic since 2025-10-31.
 *
 * Rendered by the public layout, not DocumentShell: the staff root layout shares
 * that shell, and session replay must never run over /admin or /cms, where lead
 * and customer records are on screen.
 *
 * `consentv2` is Clarity's current consent call (`consent` is deprecated). We
 * grant analytics storage only — ad storage stays denied, because the site runs
 * no advertising, which is also what the cookie banner promises. Withdrawal uses
 * `clarity('consent', false)`, the documented way to erase Clarity's cookies and
 * end the session; the tag itself cannot be unloaded mid-session.
 *
 * Keep the storage key and the event name in sync with ConsentBanner.
 */
const STORAGE_KEY = 'sm-consent'; // 'granted' | 'denied'
const CONSENT_EVENT = 'sm-consent-change';
const PROJECT_ID = 'z80885zxms';

/**
 * The `consentv2` payload, typed here so the key casing is checked at build
 * time. Both keys carry a capital `S`, and Clarity ignores an object whose keys
 * it does not recognise — silently, with no console error — which on EEA/UK/CH
 * traffic would mean recording against a denied signal.
 */
type ClarityConsent = {
  ad_Storage: 'granted' | 'denied';
  analytics_Storage: 'granted' | 'denied';
};

declare global {
  interface Window {
    clarity?: {
      (cmd: 'consentv2', consent: ClarityConsent): void;
      (cmd: 'consent', granted: boolean): void;
      q?: unknown[];
    };
  }
}

/** Inject the tag once. Mirrors Microsoft's snippet, minus its `?ref=` attribution param. */
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

    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* private mode / storage blocked — treat as no consent */
    }
    if (stored === 'granted') apply(true);

    // The banner fires this on Accept/Decline so the choice takes effect without
    // a reload, in either direction.
    const onChange = (event: Event) => apply((event as CustomEvent<boolean>).detail === true);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return null;
}
