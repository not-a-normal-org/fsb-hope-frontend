/**
 * Customer membership tiers — the single source of truth for the "user" account
 * type (the tiered Stripe customers, managed on /admin/customers).
 *
 * Tiers were renamed to cabin classes (Economy → Premium → Business → First).
 * `LEGACY_TIER_ALIASES` maps any old tier value already stored in
 * `customers.tags` to the new label so historical rows render correctly.
 *
 * Tiers are an admin tag only. They used to map to the old membership Stripe
 * prices (Explore/Platinum/Black/Concierge); those products are archived, so a
 * tier no longer implies anything that can be bought.
 */

export type CustomerTierKey = 'economy' | 'premium' | 'business' | 'first';

export interface CustomerTier {
  key: CustomerTierKey;
  label: string;
  /** Low → high, for sorting/display. */
  order: number;
}

/** Ordered low → high. */
export const CUSTOMER_TIERS: CustomerTier[] = [
  { key: 'economy', label: 'Economy', order: 1 },
  { key: 'premium', label: 'Premium', order: 2 },
  { key: 'business', label: 'Business', order: 3 },
  { key: 'first', label: 'First', order: 4 },
];

/**
 * Old tier names (as stored in `customers.tags` from the pre-rename apply flow)
 * → new tier key. Keyed by lowercased value so lookups are case-insensitive.
 */
const LEGACY_TIER_ALIASES: Record<string, CustomerTierKey> = {
  explore: 'economy',
  platinum: 'premium',
  black: 'business',
  concierge: 'first',
  // new keys/labels map to themselves so a re-tagged row still resolves
  economy: 'economy',
  premium: 'premium',
  business: 'business',
  first: 'first',
};

/**
 * Resolve a stored tier tag (old or new value) to its display label. Returns the
 * raw value unchanged if it isn't a known tier, so unrelated tags pass through.
 */
export function tierLabelFromTag(tag: string | null | undefined): string | null {
  if (!tag) return null;
  const key = LEGACY_TIER_ALIASES[tag.trim().toLowerCase()];
  if (!key) return tag;
  return CUSTOMER_TIERS.find((t) => t.key === key)?.label ?? tag;
}

/** True when a tag is a tier value (old or new) rather than an unrelated tag. */
export function isTierTag(tag: string | null | undefined): boolean {
  return Boolean(tag && tag.trim().toLowerCase() in LEGACY_TIER_ALIASES);
}

/**
 * The canonical tier key from a customer's `tags` array, or null if none is set.
 * `customers.tags` stores the tier as one entry (historically at index 0)
 * alongside unrelated tags like the referral source.
 */
export function tierKeyFromTags(tags: string[] | null | undefined): CustomerTierKey | null {
  if (!tags) return null;
  for (const tag of tags) {
    const key = LEGACY_TIER_ALIASES[tag.trim().toLowerCase()];
    if (key) return key;
  }
  return null;
}
