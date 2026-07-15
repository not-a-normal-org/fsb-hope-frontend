import 'server-only';

import Stripe from 'stripe';

// ── Client ────────────────────────────────────────────────────────────────────

// No explicit apiVersion — use the version this SDK (v22) is built against.
// The webhook reads item-level current_period_* and invoice.parent.* which only
// exist on the newer API; pinning an older version would return a different
// shape and crash those handlers at runtime.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StripeProduct {
  id: string;
  name: string;
  description: string | null;
  priceId: string;
  unitAmount: number | null;
  currency: string;
  interval: 'month' | 'year' | null;
  type: 'recurring' | 'one_time';
  active: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Authenticated fetch against the Stripe REST API with Next.js cache support. */
function stripeFetch<T>(path: string, revalidate: number): Promise<T> {
  return fetch(`https://api.stripe.com/v1/${path}`, {
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY!}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    next: { revalidate },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Stripe API error ${res.status} on /v1/${path}`);
    }
    return res.json() as Promise<T>;
  });
}

// ── Data fetching ─────────────────────────────────────────────────────────────

/**
 * Returns all active Stripe products mapped to their first active price.
 *
 * Cached for 1 hour via Next.js Data Cache (next: { revalidate: 3600 }).
 * To bust the cache after a webhook-driven update, call:
 *   revalidateTag('stripe-products')  — after adding `tags` to the fetch options
 */
export async function getActiveProducts(): Promise<StripeProduct[]> {
  // Use native fetch so Next.js Data Cache can apply revalidate.
  // The Stripe SDK uses its own HTTP client and bypasses the fetch cache.
  const [productsResponse, pricesResponse] = await Promise.all([
    stripeFetch<{ data: Stripe.Product[] }>(
      'products?active=true&limit=100',
      3600,
    ),
    stripeFetch<{ data: Stripe.Price[] }>(
      'prices?active=true&limit=100',
      3600,
    ),
  ]);

  const activePrices = pricesResponse.data.filter((p) => p.active);

  // Map productId → first active price for O(1) lookup
  const priceByProduct = new Map<string, Stripe.Price>();
  for (const price of activePrices) {
    const productId =
      typeof price.product === 'string' ? price.product : price.product?.id;
    if (productId && !priceByProduct.has(productId)) {
      priceByProduct.set(productId, price);
    }
  }

  const result: StripeProduct[] = [];

  for (const product of productsResponse.data) {
    const price = priceByProduct.get(product.id);
    if (!price) continue; // skip products with no active price

    result.push({
      id:          product.id,
      name:        product.name,
      description: product.description ?? null,
      priceId:     price.id,
      unitAmount:  price.unit_amount ?? null,
      currency:    price.currency,
      interval:
        price.recurring?.interval === 'month' ||
        price.recurring?.interval === 'year'
          ? price.recurring.interval
          : null,
      type:   price.type === 'recurring' ? 'recurring' : 'one_time',
      active: product.active,
    });
  }

  return result;
}

// ── Formatting ────────────────────────────────────────────────────────────────

/**
 * Converts a Stripe amount in cents to a human-readable currency string.
 *
 * @example
 * formatCurrency(190000, 'aud') // → "$1,900"
 * formatCurrency(9900,   'usd') // → "$99"
 */
export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-AU', {
    style:                 'currency',
    currency:              currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount / 100);
}
