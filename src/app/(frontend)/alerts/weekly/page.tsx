import type { Metadata } from 'next';

import AlertPurchase from '@/components/site/AlertPurchase';
import { PRODUCTS } from '@/lib/products';

/**
 * /alerts/weekly — buy the Weekly Lookup Alert ($4.99/mo, $49.90/yr, USD).
 * Prices are the dedicated USD Stripe products (test mode). A missing price ID
 * renders a safe "not configured" state rather than charging the wrong amount.
 */
export const metadata: Metadata = {
  title: 'Weekly Lookup Alert',
  description: PRODUCTS.weekly.tagline,
};

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
