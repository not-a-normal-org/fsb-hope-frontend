import type { Metadata } from 'next';

import LegalDoc, { type LegalContent } from '@/components/site/LegalDoc';
import type { Locale } from '@/i18n/config';
import { resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';
import en from './content.en';

/**
 * /legal/terms — Terms & Conditions. Grounded in the real fee model
 * (src/lib/products.ts) and the manual-search service. Refund/cancellation and
 * the illustrative-figures disclaimer are folded in as sections. US (Wyoming)
 * governing law. Entity: Saver Miles LLC. NOTE: reviewed for structure, not a
 * substitute for legal counsel — have a lawyer sign off before launch.
 *
 * The text is in content.<locale>.tsx.
 */
// Until the German text lands, /de serves the English.
const CONTENT: Record<Locale, LegalContent> = { en, de: en };

// Shared by both languages: the translation tracks the English text.
const UPDATED = '2026-10-28';

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = CONTENT[locale];
  return {
    title,
    description,
    ...localeMeta(locale, '/legal/terms', { robots: { index: true, follow: true } }),
  };
}

export default async function TermsPage({ params }: { params: LangParams }) {
  const locale = await resolveLocale(params);
  const { title, intro, Body } = CONTENT[locale];
  return (
    <LegalDoc locale={locale} title={title} updated={UPDATED} intro={intro}>
      <Body />
    </LegalDoc>
  );
}
