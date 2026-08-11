import type { Metadata } from 'next';

import AlertPurchase from '@/components/site/AlertPurchase';
import { PRODUCTS } from '@/lib/products';

/**
 * /alerts/human — buy the Human Search Alert (specialist-verified). Reuses the
 * Stripe "Seat Alert Service — Pro" prices (monthly + annual).
 */
export const metadata: Metadata = {
  title: 'Human Search Alert',
  description: PRODUCTS.human.tagline,
};

export default function HumanAlertPage() {
  return (
    <AlertPurchase
      product={PRODUCTS.human}
      eyebrow="Human alert"
      monthlyPriceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ALERTS_PRO_MONTHLY}
      annualPriceId={process.env.NEXT_PUBLIC_STRIPE_PRICE_ALERTS_PRO_ANNUAL}
      cancelPath="/alerts/human"
    />
  );
}
