import type { Metadata } from 'next';

import AlertPurchase from '@/components/site/AlertPurchase';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { localeMeta } from '@/lib/seo';

/**
 * /alerts/human — buy the Human Search Alert ($99.99/mo, $999.90/yr, USD).
 * Prices are the dedicated USD Stripe products (test mode). A missing price ID
 * renders a safe "not configured" state rather than charging the wrong amount.
 */
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { name, tagline } = getMessages(locale).products.human;
  return {
    title: name,
    description: tagline,
    ...localeMeta(locale, '/alerts/human'),
  };
}

export default async function HumanAlertPage({ params }: { params: LangParams }) {
  const locale = await resolveLocale(params);
  return (
    <AlertPurchase
      locale={locale}
      productId="human"
      eyebrow={getMessages(locale).alerts.humanEyebrow}
      monthlyPriceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_HUMAN_MONTHLY}
      annualPriceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_HUMAN_ANNUAL}
      cancelPath="/alerts/human"
    />
  );
}
