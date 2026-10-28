/**
 * Products — mirrors docs/plans/03-products-and-pricing.md, which is the SOURCE
 * OF TRUTH. If copy conflicts, update that doc first, then here.
 *
 * This file holds what is the same in every language: ids, prices, links, and
 * how each product is sold. The words (names, taglines, features, disclosures)
 * live in the message dictionaries under `products`, and reach the page through
 * `withCopy()`. Copy rules (doc 03 §7) apply to every language: no unqualified
 * "guarantee"; the phantom-risk product discloses the risk in the same view as
 * its price; no fake urgency.
 */

/**
 * Every published price, in USD. Copy never writes a price out: it uses
 * `{deposit}`, `{successFee}`, … placeholders that `getMessages()` fills from
 * this table in the reader's number format. Stripe charges by price id
 * (NEXT_PUBLIC_STRIPE_PRICE_*), so a change here must match the Stripe price.
 */
export const PRICES_USD = {
  deposit: 25,
  successFee: 99,
  weeklyMonthly: 4.99,
  weeklyAnnual: 49.9,
  humanMonthly: 99.99,
  humanAnnual: 999.9,
  zero: 0,
} as const;

export type ProductId = 'business' | 'individual' | 'weekly' | 'human';

/** One product's words, as the dictionaries hold them (`messages.products.<id>`). */
export type ProductCopy = {
  name: string;
  /** Headline price, e.g. "$25" — or "Custom" for Business, which isn't published. */
  price: string;
  /** Unit under the price, e.g. "deposit to start". */
  priceUnit: string;
  /** Secondary price line (Individual's success fee). */
  priceSub?: string;
  /** Annual price display, for the alert buy pages' monthly/annual toggle. */
  priceAnnual?: string;
  tagline: string;
  description: string;
  features: string[];
  /** Featured trust line (Individual's refund). Rendered prominently, success-toned. */
  footnote?: string;
  /** Neutral institutional callout (e.g. Business's "we'll come back with a quote"), so
   *  a card without a success footnote isn't left with an empty gap (§5). */
  note?: string;
  /** Phantom-flight disclosure (Weekly Lookup). Required inline with the price. */
  disclosure?: string;
  /** CTA label. */
  cta: string;
};

type ProductBase = {
  id: ProductId;
  /** Where the CTA goes. */
  href: string;
  group: 'search' | 'alert';
  /** Recurring vs one-off — set on the alert products that go through Stripe. */
  mode?: 'subscription' | 'payment';
};

export type Product = ProductBase & ProductCopy;

const BASE: Record<ProductId, ProductBase> = {
  business: { id: 'business', href: '/business', group: 'search' },
  individual: { id: 'individual', href: '/individual', group: 'search' },
  weekly: { id: 'weekly', href: '/alerts/weekly', group: 'alert', mode: 'subscription' },
  human: { id: 'human', href: '/alerts/human', group: 'alert', mode: 'subscription' },
};

/** A product with its copy in one language. */
export function withCopy(id: ProductId, copy: Record<ProductId, ProductCopy>): Product {
  return { ...BASE[id], ...copy[id] };
}

/** Ordered for the pricing page: one-off searches, then ongoing alerts. */
// Individual first — the nav, hero, and homepage all lead with individuals, so
// the pricing cards should too (Review v3 §5).
export const SEARCH_PRODUCT_IDS: ProductId[] = ['individual', 'business'];
export const ALERT_PRODUCT_IDS: ProductId[] = ['weekly', 'human'];
