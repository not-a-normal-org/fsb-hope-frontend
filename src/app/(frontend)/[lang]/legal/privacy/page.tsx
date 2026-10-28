import type { Metadata } from 'next';

import LegalDoc, { type LegalContent } from '@/components/site/LegalDoc';
import type { Locale } from '@/i18n/config';
import { resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';
import en from './content.en';
import de from './content.de';

/**
 * /legal/privacy — Privacy Policy. Grounded in the real data inventory: the
 * lead / newsletter / contact / application / alert / research forms, Stripe
 * payments (no card data stored by us), and the processors Supabase, Stripe,
 * Vercel, Google. US (Wyoming) entity with GDPR + California sections. NOTE:
 * structure-reviewed, not legal advice — have counsel sign off before launch.
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
    ...localeMeta(locale, '/legal/privacy', { robots: { index: true, follow: true } }),
  };
}

export default async function PrivacyPage({ params }: { params: LangParams }) {
  const locale = await resolveLocale(params);
  const { title, intro, Body } = CONTENT[locale];
  return (
    <LegalDoc locale={locale} title={title} updated={UPDATED} intro={intro}>
      <Body />
    </LegalDoc>
  );
}
