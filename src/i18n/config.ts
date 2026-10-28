/**
 * Locales, URL shape, and the detection inputs — the one place that knows which
 * languages the public site speaks.
 *
 * URL shape: English is the default and lives at the root with no prefix
 * (`/pricing`); German mirrors it under `/de` with the same slugs
 * (`/de/pricing`). Internally every public page lives under `app/(frontend)/[lang]`,
 * and `src/proxy.ts` rewrites unprefixed URLs to `/en/...` without changing the
 * address bar.
 *
 * Imported by `src/proxy.ts`, so — like `src/lib/maintenance.ts` — this module must
 * never pull in `server-only`, `next/headers`, or a Node built-in.
 */

export const LOCALES = ['en', 'de'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

/** BCP 47 tags for Intl formatting, `inLanguage`, and RSS `<language>`. */
export const LOCALE_TAGS: Record<Locale, string> = { en: 'en-US', de: 'de-DE' };

/** OpenGraph `og:locale` values. */
export const OG_LOCALES: Record<Locale, string> = { en: 'en_US', de: 'de_DE' };

/**
 * The visitor's explicit language choice. Set only by the language switcher —
 * never by detection — so "I picked English" survives a visit from Germany.
 */
export const LOCALE_COOKIE = 'sm-locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/** Visitors located here get German on first visit (Vercel's `x-vercel-ip-country`). */
export const GERMAN_COUNTRIES: ReadonlySet<string> = new Set(['DE', 'AT', 'CH']);

/**
 * Whether German is public. While off, `/de/*` still renders (so it can be
 * reviewed) but is noindex, and there is no geo redirect, no switcher, and no
 * German hreflang/sitemap entries. NEXT_PUBLIC_ because the switcher, a client
 * component, reads it too. Going live = `NEXT_PUBLIC_I18N_DE_LIVE=on` in Vercel.
 */
export const DE_LIVE = process.env.NEXT_PUBLIC_I18N_DE_LIVE === 'on';

/** Locales a visitor can currently be served or switch to. */
export const LIVE_LOCALES: readonly Locale[] = DE_LIVE ? LOCALES : [DEFAULT_LOCALE];

/** Takes `unknown` so API routes can check a request body's field directly. */
export function hasLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Paths that are never localized: staff surfaces, APIs, Payload, and crawler
 * files. Keep in step with the `(staff)` route group and `src/app/*` route files.
 */
const UNLOCALIZED_PREFIXES = ['/api', '/cms', '/cms-api', '/admin', '/login', '/portal', '/maintenance'];
const UNLOCALIZED_FILES = new Set(['/robots.txt', '/sitemap.xml', '/llms.txt']);

/** The one localized route with a file extension: the per-language RSS feed. */
const LOCALIZED_FILE = /^\/blog\/feed\.xml$/;

/** Whether `pathname` (with no locale prefix) is a public, localized page. */
export function isLocalizable(pathname: string): boolean {
  // Next's own endpoints (`/_next/...`, dev-only `/__nextjs_*`) are never pages.
  if (pathname.startsWith('/_')) return false;
  if (UNLOCALIZED_FILES.has(pathname)) return false;
  if (UNLOCALIZED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return false;
  }
  // Anything else with a file extension is a static asset from /public.
  const last = pathname.slice(pathname.lastIndexOf('/') + 1);
  return !last.includes('.') || LOCALIZED_FILE.test(pathname);
}

/** The locale a pathname is prefixed with (`/de/x` → `de`), or null if none. */
export function localeOf(pathname: string): Locale | null {
  for (const locale of LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) return locale;
  }
  return null;
}

/**
 * Drop any locale prefix: `/de/pricing` → `/pricing`, `/en` → `/`. Handles `/en`
 * too because the server sees the rewritten `/en/...` path while the browser sees
 * the unprefixed one — normalising both gives the same answer on each side.
 */
export function stripLocale(pathname: string): string {
  const locale = localeOf(pathname);
  if (!locale) return pathname || '/';
  return pathname.slice(locale.length + 1) || '/';
}

/**
 * The public URL of `href` in `locale`: English unprefixed, German under `/de`.
 * Only root-relative app paths are touched; external URLs, `#hash`, `mailto:`,
 * and unlocalized paths (`/api`, `/admin`, assets) pass through unchanged. A
 * query string or hash on `href` is kept.
 */
export function localizePath(locale: Locale, href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const cut = href.search(/[?#]/);
  const path = cut === -1 ? href : href.slice(0, cut);
  const rest = cut === -1 ? '' : href.slice(cut);
  const bare = stripLocale(path);
  if (!isLocalizable(bare) || locale === DEFAULT_LOCALE) return bare + rest;
  return (bare === '/' ? `/${locale}` : `/${locale}${bare}`) + rest;
}
