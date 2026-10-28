import type { Metadata } from 'next';

import LegalDoc, { type LegalContent } from '@/components/site/LegalDoc';
import type { Locale } from '@/i18n/config';
import { resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';
import en from './content.en';
import de from './content.de';

/**
 * /legal/cookies — Cookie Policy. Lists the exact cookies/storage the site sets
 * today (referral, session, theme, language, newsletter-popup) plus Google
 * Analytics 4 for aggregate traffic measurement, and how to opt out. No
 * advertising cookies. NOTE: structure-reviewed, not legal advice.
 *
 * The text is in content.<locale>.tsx. The German version is a convenience
 * translation; the English version governs, and both say so.
 */
const CONTENT: Record<Locale, LegalContent> = { en, de };

// Shared by both languages: the translation tracks the English text.
const UPDATED = '2026-10-28';

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = CONTENT[locale];
  return {
    title,
    description,
    ...localeMeta(locale, '/legal/cookies', { robots: { index: true, follow: true } }),
  };
}

export default async function CookiePolicyPage({ params }: { params: LangParams }) {
  const locale = await resolveLocale(params);
  const { title, intro, Body } = CONTENT[locale];
  return (
    <LegalDoc locale={locale} title={title} updated={UPDATED} intro={intro}>
      <Body />
    </LegalDoc>
  );
}
