import type { Metadata } from 'next';

import AlertPurchase from '@/components/site/AlertPurchase';
import { PRODUCTS } from '@/lib/products';
import { resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';

/**
 * /alerts/weekly — buy the Weekly Lookup Alert ($4.99/mo, $49.90/yr, USD).
 * Prices are the dedicated USD Stripe products (test mode). A missing price ID
 * renders a safe "not configured" state rather than charging the wrong amount.
 */
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    title: 'Weekly Lookup Alert',
    description: PRODUCTS.weekly.tagline,
    ...localeMeta(locale, '/alerts/weekly'),
  };
}

export default function WeeklyAlertPage() {
  return (
    <AlertPurchase
      product={PRODUCTS.weekly}
      eyebrow="Weekly alert"
      monthlyPriceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_WEEKLY_MONTHLY}
      annualPriceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_WEEKLY_ANNUAL}
      cancelPath="/alerts/weekly"
    />
  );
}
