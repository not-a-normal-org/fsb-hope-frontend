import type { Metadata } from 'next';

import AlertPurchase from '@/components/site/AlertPurchase';
import { PRODUCTS } from '@/lib/products';

/**
 * /alerts/weekly — buy the Weekly Lookup Alert (the automated scan). Reuses the
 * Stripe "Seat Alert Service — Essential" prices (monthly + annual).
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
      monthlyPriceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ALERTS_ESSENTIAL_MONTHLY}
      annualPriceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ALERTS_ESSENTIAL_ANNUAL}
      cancelPath="/alerts/weekly"
    />
  );
}
