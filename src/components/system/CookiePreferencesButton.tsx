'use client';

/**
 * Footer control that re-opens the cookie-consent banner, so a visitor can change
 * or withdraw their choice as easily as they gave it (a GDPR expectation).
 * Calls the opener that ConsentBanner registers on `window`.
 */
export default function CookiePreferencesButton({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.smOpenConsent?.()}
      className={`text-sm text-ink-sub transition-colors hover:text-ink ${className}`}
    >
      Cookie preferences
    </button>
  );
}
