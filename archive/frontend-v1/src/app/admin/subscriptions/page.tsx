import Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { cancelSubscription } from './actions';

// ── Types ─────────────────────────────────────────────────────────────────────

type SubStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'paused' | 'incomplete' | 'incomplete_expired';

interface Customer { email: string | null; full_name: string | null; }

interface Subscription {
  id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  stripe_price_id: string;
  status: SubStatus;
  current_period_end: string;
  cancel_at_period_end: boolean;
  customer: Customer | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TIER_NAMES: Record<string, string> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_EXPLORE!]:    'Explore',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_PLATINUM!]:   'Platinum',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_BLACK!]:      'Black',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_CONCIERGE!]:  'Concierge',
};

function tierName(priceId: string): string {
  return TIER_NAMES[priceId] ?? `…${priceId.slice(-6)}`;
}

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
}

function fmtUSD(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(cents / 100);
}

const STATUS_STYLES: Record<SubStatus, string> = {
  active:             'bg-green-500/10  text-green-400  border border-green-500/20',
  past_due:           'bg-red-500/10    text-red-400    border border-red-500/20',
  canceled:           'bg-[#1E2538]     text-[#5C6378]  border border-[#1E2538]',
  trialing:           'bg-blue-500/10   text-blue-400   border border-blue-500/20',
  paused:             'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  incomplete:         'bg-[#1E2538]     text-[#5C6378]  border border-[#1E2538]',
  incomplete_expired: 'bg-[#1E2538]     text-[#5C6378]  border border-[#1E2538]',
};

function StatusBadge({ status }: { status: SubStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.canceled}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchData() {
  // 1. Subscriptions
  const { data: rows } = await supabaseAdmin
    .from('subscriptions')
    .select('id, stripe_subscription_id, stripe_customer_id, stripe_price_id, status, current_period_end, cancel_at_period_end')
    .order('current_period_end', { ascending: false });

  const subs = (rows ?? []) as Omit<Subscription, 'customer'>[];

  // 2. Customers (deduplicated lookup)
  const custIds = [...new Set(subs.map((s) => s.stripe_customer_id))];
  const { data: custRows } = custIds.length
    ? await supabaseAdmin
        .from('customers')
        .select('stripe_customer_id, email, full_name')
        .in('stripe_customer_id', custIds)
    : { data: [] };

  const custMap = new Map((custRows ?? []).map((c) => [c.stripe_customer_id, c as Customer]));

  const subscriptions: Subscription[] = subs.map((s) => ({
    ...s,
    status: s.status as SubStatus,
    customer: custMap.get(s.stripe_customer_id) ?? null,
  }));

  // 3. Stripe prices for ARR (active only, deduplicated)
  const activePriceIds = [...new Set(
    subscriptions.filter((s) => s.status === 'active').map((s) => s.stripe_price_id),
  )];

  const priceResults = await Promise.allSettled(
    activePriceIds.map((id) => stripe.prices.retrieve(id)),
  );

  const priceMap = new Map<string, Stripe.Price>();
  priceResults.forEach((r, i) => {
    if (r.status === 'fulfilled') priceMap.set(activePriceIds[i], r.value);
  });

  // ARR = sum(unit_amount × 12 if monthly, × 1 if annual) for active subs
  const arrCents = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => {
      const price = priceMap.get(s.stripe_price_id);
      if (!price?.unit_amount) return sum;
      const multiplier = price.recurring?.interval === 'year' ? 1 : 12;
      return sum + price.unit_amount * multiplier;
    }, 0);

  const activeCount   = subscriptions.filter((s) => s.status === 'active').length;
  const pastDueCount  = subscriptions.filter((s) => s.status === 'past_due').length;

  return { subscriptions, activeCount, pastDueCount, arrCents, priceMap };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function SubscriptionsPage() {
  const { subscriptions, activeCount, pastDueCount, arrCents, priceMap } = await fetchData();

  return (
    <div className="space-y-6">

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active',           value: activeCount.toLocaleString('en-AU') },
          { label: 'Past Due',         value: pastDueCount.toLocaleString('en-AU') },
          { label: 'Est. Annual ARR',  value: fmtUSD(arrCents) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#13182A] border border-[#1E2538] rounded-xl px-5 py-4">
            <p className="text-[10px] uppercase tracking-widest text-[#5C6378] mb-1.5">{label}</p>
            <p className="text-2xl font-bold text-[#F5F5F0] tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#13182A] border border-[#1E2538] rounded-2xl overflow-hidden">
        {subscriptions.length === 0 ? (
          <p className="text-center text-sm text-[#5C6378] py-16">No subscriptions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2538]">
                  {['Customer', 'Tier', 'Status', 'Renews', 'Cancel at end?', 'Price', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#5C6378] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub, i) => {
                  const price = priceMap.get(sub.stripe_price_id);
                  const priceLabel = price?.unit_amount
                    ? `${fmtUSD(price.unit_amount)}/${price.recurring?.interval ?? 'mo'}`
                    : '—';

                  const cancelAction = cancelSubscription.bind(
                    null,
                    sub.id,
                    sub.stripe_subscription_id,
                  );

                  return (
                    <tr
                      key={sub.id}
                      className={`transition-colors hover:bg-[#0E1220] ${i < subscriptions.length - 1 ? 'border-b border-[#1E2538]' : ''}`}
                    >
                      {/* Customer */}
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-[#F5F5F0] leading-tight">
                          {sub.customer?.full_name ?? <span className="text-[#5C6378]">Unknown</span>}
                        </p>
                        <p className="text-xs text-[#9DA3B4] mt-0.5">{sub.customer?.email ?? '—'}</p>
                      </td>
                      {/* Tier */}
                      <td className="px-5 py-3.5 text-[#F5F5F0] font-medium">{tierName(sub.stripe_price_id)}</td>
                      {/* Status */}
                      <td className="px-5 py-3.5"><StatusBadge status={sub.status} /></td>
                      {/* Renewal date */}
                      <td className="px-5 py-3.5 text-[#9DA3B4] tabular-nums whitespace-nowrap">{fmtDate(sub.current_period_end)}</td>
                      {/* Cancel at period end */}
                      <td className="px-5 py-3.5 text-center">
                        {sub.cancel_at_period_end ? (
                          <span className="text-yellow-400 text-xs">Yes</span>
                        ) : (
                          <span className="text-[#5C6378] text-xs">No</span>
                        )}
                      </td>
                      {/* Price */}
                      <td className="px-5 py-3.5 text-[#9DA3B4] tabular-nums whitespace-nowrap">{priceLabel}</td>
                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        {sub.status === 'active' && (
                          <form action={cancelAction}>
                            <button
                              type="submit"
                              className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400/40 px-3 py-1 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
