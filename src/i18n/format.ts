import { LOCALE_TAGS, type Locale } from './config';

/**
 * Fill `{name}` placeholders in a message: `fmt('Step {n} of {total}', { n: 1, total: 4 })`.
 * An unknown placeholder is left as written, so a typo shows up on the page
 * instead of vanishing.
 */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

/**
 * Pick the singular or plural form for a count and fill its `{n}`:
 * `plural('de', 2, { one: '{n} Platz', other: '{n} Plätze' })` → "2 Plätze".
 */
export function plural(locale: Locale, n: number, forms: { one: string; other: string }): string {
  const form = new Intl.PluralRules(LOCALE_TAGS[locale]).select(n) === 'one' ? forms.one : forms.other;
  return fmt(form, { n: formatNumber(locale, n) });
}

/**
 * A USD amount in the locale's currency format: `$4.99` / `4,99 $`. Whole amounts
 * drop the cents (`$25`), so prices read the way the copy has always written them.
 * Every price on the site is USD; German pages say so once on /pricing.
 */
export function formatPrice(locale: Locale, usd: number): string {
  const digits = Number.isInteger(usd) ? 0 : 2;
  return new Intl.NumberFormat(LOCALE_TAGS[locale], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(usd);
}

/** A count with the locale's grouping: `75,000` / `75.000`. */
export function formatNumber(locale: Locale, n: number): string {
  return n.toLocaleString(LOCALE_TAGS[locale]);
}

/** A date with the locale's names and order: `Oct 24, 2026` / `24. Okt. 2026`. */
export function formatDate(
  locale: Locale,
  value: string | number | Date,
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' },
): string {
  return new Date(value).toLocaleDateString(LOCALE_TAGS[locale], options);
}

/**
 * Day and short month, for the example cards: `24 Oct` / `24. Okt.`. English uses
 * en-GB here because the cards have always read day-first.
 */
export function formatDayMonth(locale: Locale, isoDate: string): string {
  const tag = locale === 'en' ? 'en-GB' : LOCALE_TAGS[locale];
  return new Date(`${isoDate}T12:00:00Z`).toLocaleDateString(tag, {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  });
}
