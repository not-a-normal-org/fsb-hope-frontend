import 'server-only';

import { notFound } from 'next/navigation';

import { PRICES_USD } from '@/lib/products';
import { hasLocale, type Locale } from './config';
import { fmt, formatPrice } from './format';
import en, { type Messages } from './messages/en';
import de from './messages/de';

/** Fill the price placeholders in every string of a dictionary, leaving others. */
function fillPrices<T>(value: T, prices: Record<string, string>): T {
  if (typeof value === 'string') return fmt(value, prices) as T;
  if (Array.isArray(value)) return value.map((v) => fillPrices(v, prices)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, fillPrices(v, prices)]),
    ) as T;
  }
  return value;
}

function withPrices(messages: Messages, locale: Locale): Messages {
  const prices = Object.fromEntries(
    Object.entries(PRICES_USD).map(([key, usd]) => [key, formatPrice(locale, usd)]),
  );
  return fillPrices(messages, prices);
}

// Built once per server process: every `{deposit}`-style placeholder is already
// a formatted price by the time a component reads a string.
const MESSAGES: Record<Locale, Messages> = { en: withPrices(en, 'en'), de: withPrices(de, 'de') };

/** Route params of every page under `app/(frontend)/[lang]`. */
export type LangParams = Promise<{ lang: string }>;

/**
 * The page's locale from its `[lang]` param — 404 for anything else. The proxy
 * only ever routes `en` and `de` here, so the 404 is a guard, not a code path.
 */
export async function resolveLocale(params: LangParams): Promise<Locale> {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return lang;
}

/** The full dictionary for a locale. Server components only. */
export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale];
}

/**
 * The namespaces client components read through `useI18n()`. Only these cross
 * the server/client boundary (they ride in every page's RSC payload), so page
 * copy is passed to its sections as props instead of being added here.
 */
const CLIENT_NAMESPACES = [
  'links',
  'navGroups',
  'nav',
  'footer',
  'theme',
  'language',
  'consent',
  'notFound',
  // Shared widgets that sit inside client trees on many pages.
  'common',
  'stats',
  'report',
  'caseStudy',
  'lead',
  'newsletter',
  'checkout',
] as const;

export type ClientMessages = Pick<Messages, (typeof CLIENT_NAMESPACES)[number]>;

export function getClientMessages(locale: Locale): ClientMessages {
  const m = MESSAGES[locale];
  return Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, m[ns]])) as ClientMessages;
}
