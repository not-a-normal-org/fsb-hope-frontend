import en from '@/i18n/messages/en';

/**
 * Admin display label for a Stripe price id — what the orders/subscriptions
 * views show in their product column.
 *
 * Only the alert subscriptions are sold through Stripe today (docs/plans/03), so
 * those are the ids we can name. Staff screens are English, so the names come
 * from the English dictionary. Anything else (a price added later, or one from
 * before the old products were archived) falls back to a short id suffix so a
 * row never renders blank.
 */
const PLANS: [priceId: string | undefined, name: string][] = [
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_WEEKLY_MONTHLY, `${en.products.weekly.name} · monthly`],
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_WEEKLY_ANNUAL, `${en.products.weekly.name} · annual`],
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_HUMAN_MONTHLY, `${en.products.human.name} · monthly`],
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_HUMAN_ANNUAL, `${en.products.human.name} · annual`],
];

const PLAN_BY_PRICE_ID = new Map<string, string>();
for (const [priceId, name] of PLANS) {
  if (priceId) PLAN_BY_PRICE_ID.set(priceId, name);
}

export function planNameByPriceId(priceId: string | null | undefined): string {
  if (!priceId) return 'One-time';
  return PLAN_BY_PRICE_ID.get(priceId) ?? `…${priceId.slice(-6)}`;
}
