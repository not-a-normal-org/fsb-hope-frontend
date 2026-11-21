/**
 * Cookie consent, shared by the banner, the pre-paint scripts, the tags it gates
 * (Google tag, Clarity) and the proxy.
 *
 * Two regimes, decided by where the visitor is:
 * - **EEA, UK and Switzerland (`CONSENT_REGIONS`): opt-in.** Nothing that measures
 *   or advertises runs until the visitor clicks Accept.
 * - **Everywhere else: opt-out.** Analytics, ad measurement and remarketing run by
 *   default; Decline (in the banner or "Cookie preferences" in the footer) turns
 *   them off. A browser sending Global Privacy Control never gets remarketing.
 *
 * Clarity's session replay is stricter than both: it loads only after Accept, in
 * every region (see ClarityScript).
 *
 * Google enforces the regions itself: the consent defaults in DocumentShell pass
 * `CONSENT_REGIONS` to `gtag('consent', 'default', { region })`, and the proxy
 * reads the same list before it stores an ad-click ID.
 *
 * Changing what Accept covers means asking again: bump `CONSENT_KEY`. v2
 * (2026-11-22) added Google Ads measurement and remarketing to a banner that had
 * promised "no advertising", so a v1 "granted" is not carried over. A v1 "denied"
 * is: someone who said no to less has said no to more.
 */

/** localStorage key holding the visitor's choice: 'granted' | 'denied'. */
export const CONSENT_KEY = 'sm-consent-v2';
/** The v1 key. Read only to carry a "denied" forward. */
export const LEGACY_CONSENT_KEY = 'sm-consent';
/** Fired on window with `detail: boolean` when the visitor decides. */
export const CONSENT_EVENT = 'sm-consent-change';

/** Where consent is opt-in: the EEA (EU + Iceland, Liechtenstein, Norway), the UK and Switzerland. */
export const CONSENT_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
  'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'IS', 'LI', 'NO',
  'GB', 'CH',
] as const;

const CONSENT_REGION_SET: ReadonlySet<string> = new Set(CONSENT_REGIONS);

/** Whether a country (ISO 3166-1 alpha-2, any case) is opt-in. Unknown counts as opt-in. */
export function requiresOptIn(country: string | null | undefined): boolean {
  return !country || CONSENT_REGION_SET.has(country.toUpperCase());
}

export type ConsentChoice = 'granted' | 'denied';

/**
 * The visitor's stored choice, or null if they haven't made one (or storage is
 * blocked). Client-only. The pre-paint scripts inline the same rule as a string,
 * so keep `consentChoiceJs` below in step with it.
 */
export function readConsent(): ConsentChoice | null {
  try {
    const current = localStorage.getItem(CONSENT_KEY);
    if (current === 'granted' || current === 'denied') return current;
    return localStorage.getItem(LEGACY_CONSENT_KEY) === 'denied' ? 'denied' : null;
  } catch {
    return null;
  }
}

/** `readConsent()` as an inline-script expression, for the <head> scripts that run before React. */
export const consentChoiceJs =
  `(function(){try{var c=localStorage.getItem('${CONSENT_KEY}');` +
  `if(c==='granted'||c==='denied')return c;` +
  `return localStorage.getItem('${LEGACY_CONSENT_KEY}')==='denied'?'denied':null;}catch(e){return null}})()`;

/** Whether the browser sends Global Privacy Control (an opt-out of targeted advertising). */
export function hasGpc(): boolean {
  return typeof navigator !== 'undefined' && (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

/** The Google Consent Mode state for a choice. Remarketing also needs no GPC. */
export function googleConsentFor(choice: ConsentChoice, gpc: boolean) {
  return {
    ad_storage: choice,
    ad_user_data: choice,
    analytics_storage: choice,
    ad_personalization: choice === 'granted' && !gpc ? 'granted' : 'denied',
  } as const;
}
