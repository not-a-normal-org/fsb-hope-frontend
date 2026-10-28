'use client';

import { usePathname } from 'next/navigation';

import {
  DE_LIVE,
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  localizePath,
  stripLocale,
  type Locale,
} from '@/i18n/config';
import { useI18n } from '@/i18n/LocaleProvider';

/**
 * English ⇄ German switch. `pill` is the segmented control for the footer and
 * mobile menu (styled to sit beside ModeToggle); `compact` is a single icon-sized
 * button for the nav bar, labelled with the language it switches to.
 *
 * Each option is a real link to the same page in the other language, so it works
 * without JS and crawlers can follow it. The click also stores the choice in the
 * `sm-locale` cookie before the browser navigates. That cookie is what stops
 * src/proxy.ts from geo-redirecting a visitor in Germany straight back to German
 * after they pick English.
 *
 * The target path comes from `stripLocale(usePathname())`: the server sees the
 * rewritten `/en/x` and the browser sees `/x`, and stripping gives `/x` on both
 * sides, so the href hydrates without a mismatch.
 *
 * Renders nothing until German is live (DE_LIVE).
 */
function remember(locale: Locale) {
  const secure = window.location.protocol === 'https:' ? '; secure' : '';
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax${secure}`;
}

const GLASS = {
  borderColor: 'var(--sm-glass-border)',
  background: 'var(--sm-glass-bg)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
} as const;

export default function LanguageSwitcher({
  variant = 'pill',
  className = '',
}: {
  variant?: 'pill' | 'compact';
  className?: string;
}) {
  const { locale, m } = useI18n();
  const base = stripLocale(usePathname() ?? '/');

  if (!DE_LIVE) return null;

  if (variant === 'compact') {
    const target: Locale = locale === 'de' ? 'en' : 'de';
    return (
      <a
        href={localizePath(target, base)}
        hrefLang={target}
        onClick={() => remember(target)}
        aria-label={`${m.language.label}: ${m.language.names[target]}`}
        title={m.language.names[target]}
        className={`inline-flex h-9 w-9 items-center justify-center rounded-full border font-mono text-[11px] uppercase tracking-[0.06em] text-ink transition-colors ${className}`}
        style={GLASS}
      >
        {target}
      </a>
    );
  }

  return (
    <nav
      aria-label={m.language.label}
      className={`inline-flex overflow-hidden rounded-full border p-0.5 ${className}`}
      style={GLASS}
    >
      {LOCALES.map((l) => {
        const shared = {
          lang: l,
          'aria-label': m.language.names[l],
          title: m.language.names[l],
          className:
            'rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] transition-colors',
        };
        return l === locale ? (
          <span
            key={l}
            aria-current="true"
            {...shared}
            style={{ color: 'var(--sm-ink)', background: 'var(--sm-glass-border)' }}
          >
            {l}
          </span>
        ) : (
          <a
            key={l}
            href={localizePath(l, base)}
            hrefLang={l}
            onClick={() => remember(l)}
            {...shared}
            style={{ color: 'var(--sm-ink)', opacity: 0.55 }}
          >
            {l}
          </a>
        );
      })}
    </nav>
  );
}
