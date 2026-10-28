import type { Metadata } from 'next';

import AlertPurchase from '@/components/site/AlertPurchase';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';

/**
 * /alerts/weekly — buy the Weekly Lookup Alert ($4.99/mo, $49.90/yr, USD).
 * Prices are the dedicated USD Stripe products (test mode). A missing price ID
 * renders a safe "not configured" state rather than charging the wrong amount.
 */
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { name, tagline } = getMessages(locale).products.weekly;
  return {
    title: name,
    description: tagline,
    ...localeMeta(locale, '/alerts/weekly'),
  };
}

export default async function WeeklyAlertPage({ params }: { params: LangParams }) {
  const locale = await resolveLocale(params);
  return (
    <AlertPurchase
      locale={locale}
      productId="weekly"
      eyebrow={getMessages(locale).alerts.weeklyEyebrow}
      monthlyPriceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_WEEKLY_MONTHLY}
      annualPriceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_WEEKLY_ANNUAL}
      cancelPath="/alerts/weekly"
    />
  );
}
