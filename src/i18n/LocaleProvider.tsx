'use client';

import { createContext, useContext } from 'react';

import type { Locale } from './config';
import type { ClientMessages } from './get-messages';

type I18n = { locale: Locale; m: ClientMessages };

const I18nContext = createContext<I18n | null>(null);

/**
 * Hands client components the page's locale and the client-side message
 * namespaces. Mounted by DocumentShell, so it wraps every public and staff page.
 */
export default function LocaleProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: ClientMessages;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={{ locale, m: messages }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n() must be used inside <LocaleProvider>');
  return ctx;
}

export function useLocale(): Locale {
  return useI18n().locale;
}
