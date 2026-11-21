/**
 * Google tag IDs, ad-click attribution and the lead conversion.
 *
 * The tag itself is loaded by DocumentShell (public site only) under the consent
 * rules in src/lib/consent.ts. IDs are public by nature (they ship in every page),
 * so they live here rather than in env vars, like Clarity's project ID.
 *
 * The lead conversion fires in the browser when the lead form's API call
 * succeeds. The $25 deposit and the $99 fee are paid on Stripe Payment Links the
 * team sends later, so they can't fire from the page: they are uploaded to
 * Google Ads afterwards, matched by the click ID stored with the lead
 * (`details.gclid` / `gbraid` / `wbraid`). docs/marketing/google-ads.md has the steps.
 */

/** Google Analytics 4 measurement ID. */
export const GA_MEASUREMENT_ID = 'G-50ZT6S22C6';

/** Google Ads conversion ID (`AW-…`). Empty until the account exists: no Ads tag loads. */
export const GOOGLE_ADS_ID = '';
/** Label of the "Lead form submit" conversion action. */
export const ADS_LEAD_LABEL = '';

// ── Ad-click attribution ──────────────────────────────────────────────────────

/**
 * First-party cookie holding the last Google Ads click ID, as `<param>:<id>`.
 * Set by the proxy only for visitors outside CONSENT_REGIONS, cleared when the
 * visitor declines, and read by /api/leads into the lead record.
 */
export const CLICK_COOKIE = 'sm_gclick';
/** 90 days: the window in which Google Ads accepts a conversion for a click. */
export const CLICK_MAX_AGE_DAYS = 90;
/** URL parameters Google Ads auto-tagging adds (gbraid/wbraid on iOS app and web-to-app traffic). */
export const CLICK_ID_PARAMS = ['gclid', 'gbraid', 'wbraid'] as const;
export type ClickIdParam = (typeof CLICK_ID_PARAMS)[number];

const CLICK_ID_RE = /^[A-Za-z0-9_-]{8,256}$/;

/** The click ID in a query string, if any. gclid wins when several are present. */
export function clickIdFrom(params: URLSearchParams): { param: ClickIdParam; id: string } | null {
  for (const param of CLICK_ID_PARAMS) {
    const id = params.get(param)?.trim();
    if (id && CLICK_ID_RE.test(id)) return { param, id };
  }
  return null;
}

/** Parse the cookie written by the proxy. Anything malformed is ignored. */
export function parseClickCookie(value: string | undefined): { param: ClickIdParam; id: string } | null {
  if (!value) return null;
  const sep = value.indexOf(':');
  const param = value.slice(0, sep) as ClickIdParam;
  const id = value.slice(sep + 1);
  return sep > 0 && CLICK_ID_PARAMS.includes(param) && CLICK_ID_RE.test(id) ? { param, id } : null;
}

// ── Conversions (client) ──────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * A phone number in E.164 (`+14155550123`) for enhanced conversions, or
 * undefined. Only numbers the visitor typed with a `+` country code qualify;
 * guessing a country code would send Google a wrong number.
 */
export function toE164(raw: string | null | undefined): string | undefined {
  const trimmed = (raw ?? '').trim();
  if (!trimmed.startsWith('+')) return undefined;
  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15 ? `+${digits}` : undefined;
}

/**
 * Report a submitted lead: the Google Ads conversion (with the email and phone
 * for enhanced conversions; gtag hashes them before sending, and drops them when
 * the visitor has not consented to ad data) and GA4's `generate_lead` event.
 * Consent Mode decides what actually leaves the browser.
 */
export function trackLead(lead: { type: string; email: string; phone?: string | null }): void {
  const gtag = typeof window === 'undefined' ? undefined : window.gtag;
  if (!gtag) return;
  const phone_number = toE164(lead.phone);
  gtag('set', 'user_data', { email: lead.email.trim().toLowerCase(), ...(phone_number ? { phone_number } : {}) });
  if (GOOGLE_ADS_ID && ADS_LEAD_LABEL) {
    gtag('event', 'conversion', { send_to: `${GOOGLE_ADS_ID}/${ADS_LEAD_LABEL}` });
  }
  gtag('event', 'generate_lead', { lead_type: lead.type });
}
