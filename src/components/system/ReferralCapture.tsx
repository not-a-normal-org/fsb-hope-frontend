'use client';

import { useEffect } from 'react';

import { REF_COOKIE, REF_MAX_AGE_DAYS, sanitizeRefCode } from '@/lib/referral';

/**
 * Captures `?ref=<code>` from the landing URL into the `sm_ref` cookie so the
 * lead/newsletter API routes can attribute a submission to an affiliate.
 * First-touch: an existing cookie is never overwritten, so the original referrer
 * keeps the credit. Renders nothing. Reads `window.location.search` directly (no
 * useSearchParams) so it needs no Suspense boundary.
 */
export default function ReferralCapture() {
  useEffect(() => {
    const code = sanitizeRefCode(new URLSearchParams(window.location.search).get('ref'));
    if (!code) return;

    const hasCookie = document.cookie
      .split('; ')
      .some((c) => c.startsWith(`${REF_COOKIE}=`));
    if (hasCookie) return; // first-touch wins

    const maxAge = REF_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = `${REF_COOKIE}=${encodeURIComponent(code)}; path=/; max-age=${maxAge}; samesite=lax`;
  }, []);

  return null;
}
