import 'server-only';

import { notFound } from 'next/navigation';

import { hasLocale, type Locale } from './config';
import en, { type Messages } from './messages/en';
import de from './messages/de';

const MESSAGES: Record<Locale, Messages> = { en, de };

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
] as const;

export type ClientMessages = Pick<Messages, (typeof CLIENT_NAMESPACES)[number]>;

export function getClientMessages(locale: Locale): ClientMessages {
  const m = MESSAGES[locale];
  return Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, m[ns]])) as ClientMessages;
}
