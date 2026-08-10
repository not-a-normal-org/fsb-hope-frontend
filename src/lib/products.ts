/**
 * Product display data — mirrors docs/plans/03-products-and-pricing.md, which is
 * the SOURCE OF TRUTH. If copy conflicts, update that doc first, then here.
 *
 * Copy rules enforced (doc 03 §7): no unqualified "guarantee"; the phantom-risk
 * product discloses the risk in the same view as its price; no fake urgency.
 * Stripe price IDs are intentionally absent — payments are a later phase.
 */

export type Product = {
  id: string;
  name: string;
  /** Headline price, e.g. "$25". */
  price: string;
  /** Unit under the price, e.g. "flat · per search". */
  priceUnit: string;
  /** Secondary price line (Individual's success fee). */
  priceSub?: string;
  tagline: string;
  description: string;
  features: string[];
  /** Featured trust line (Individual's refund). Rendered prominently, success-toned. */
  footnote?: string;
  /** Neutral institutional callout (e.g. Business's "invoiced, not per seat"), so
   *  a card without a success footnote isn't left with an empty gap (§5). */
  note?: string;
  /** Phantom-flight disclosure (Weekly Lookup). Required inline with the price. */
  disclosure?: string;
  cta: { label: string; href: string };
  group: 'search' | 'alert';
};

const CONTACT = 'mailto:hello@savermiles.com';

export const PRODUCTS: Record<string, Product> = {
  business: {
    id: 'business',
    name: 'Business Search',
    price: '$25',
    priceUnit: 'flat · per search',
    tagline: 'The account-level entry point for company travel.',
    description:
      'Send us a route and what you need. A specialist works 30+ loyalty programs and sends back the results, with screenshots and the exact point cost. Charged once, when you submit.',
    features: [
      'A specialist works 30+ programs for you',
      'Screenshots and the exact point cost',
      'Per-search billing, no subscription',
    ],
    note: 'Invoiced per search — never charged per seat.',
    cta: { label: 'Start a business search', href: '/business' },
    group: 'search',
  },

  individual: {
    id: 'individual',
    name: 'Individual Search',
    price: '$25',
    priceUnit: 'deposit to start',
    priceSub: '+ $99 per person, per direction, charged only once we confirm a seat you can book.',
    tagline: 'Pay the fee only if your specialist finds a real seat.',
    description:
      'A specialist works the points you already hold across every program that fits. The $99 fee is flat, the same for economy, business, or first.',
    features: [
      '$99 flat success fee, any cabin',
      'Verified by your specialist before you owe the fee',
      'Only pay the fee on a confirmed, bookable seat',
    ],
    footnote: 'Find nothing bookable? Your $25 deposit comes back in full.',
    cta: { label: 'Start an individual search', href: '/individual' },
    group: 'search',
  },

  weekly: {
    id: 'weekly',
    name: 'Weekly Lookup Alert',
    price: '$4.99',
    priceUnit: '/ month',
    tagline: 'An early signal on routes you’re watching casually.',
    description:
      'Every Monday for 12 months, a scan of your routes: which airlines show award space, which card programs transfer in, the dates, and the points. Cheap enough to set and forget — a heads-up, not a booking.',
    features: [
      'Delivered every Monday, for 12 months',
      'Airlines, transfer partners, dates, points',
      'Cancel anytime',
    ],
    disclosure:
      'Automated scan — shows availability, not a confirmed seat, and some space may be phantom. For a booking you can rely on, use the Human Search Alert or a one-off search.',
    cta: { label: 'Get weekly alerts', href: `${CONTACT}?subject=Weekly%20Lookup%20Alert` },
    group: 'alert',
  },

  human: {
    id: 'human',
    name: 'Human Search Alert',
    price: '$99.99',
    priceUnit: '/ month',
    tagline: 'A specialist confirms the seat before you hear from us.',
    description:
      'The same rigor as our one-off search, run as an ongoing service. A specialist checks your routes each cycle and sends verified results, the opposite of an automated scan.',
    features: [
      'Specialist-run search, every cycle',
      'Verified bookable space, not raw feed data',
      'Monthly, cancel anytime',
    ],
    cta: { label: 'Get human alerts', href: `${CONTACT}?subject=Human%20Search%20Alert` },
    group: 'alert',
  },
};

/** Ordered for the pricing page: one-off searches, then ongoing alerts. */
// Individual first — the nav, hero, and homepage all lead with individuals, so
// the pricing cards should too (Review v3 §5).
export const SEARCH_PRODUCTS = [PRODUCTS.individual, PRODUCTS.business];
export const ALERT_PRODUCTS = [PRODUCTS.weekly, PRODUCTS.human];
