import Link from 'next/link';

import { supabaseAdmin } from '@/lib/supabase/admin';

// ── Types ─────────────────────────────────────────────────────────────────────

type OrderStatus = 'paid' | 'pending' | 'refunded' | 'failed';

interface Order {
  id: string;
  stripe_customer_id: string;
  stripe_price_id: string | null;
  amount_cents: number;
  status: OrderStatus;
  created_at: string;
  customer: { email: string | null; full_name: string | null } | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const TIER_NAMES: Record<string, string> = {
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_EXPLORE!]:   'Explore',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_PLATINUM!]:  'Platinum',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_BLACK!]:     'Black',
  [process.env.NEXT_PUBLIC_STRIPE_PRICE_CONCIERGE!]: 'Concierge',
};

function tierName(priceId: string | null): string {
  if (!priceId) return 'One-time';
  return TIER_NAMES[priceId] ?? `…${priceId.slice(-6)}`;
}

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(iso));
}

function fmtAUD(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(cents / 100);
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  paid:     'bg-green-500/10  text-green-400  border border-green-500/20',
  pending:  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  refunded: 'bg-blue-500/10   text-blue-400   border border-blue-500/20',
  failed:   'bg-red-500/10    text-red-400    border border-red-500/20',
};

const TABS: { label: string; value: string }[] = [
  { label: 'All',      value: 'all'      },
  { label: 'Paid',     value: 'paid'     },
  { label: 'Pending',  value: 'pending'  },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Failed',   value: 'failed'   },
];

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-[#1E2538] text-[#5C6378]'}`}>
      {status}
    </span>
  );
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchOrders(statusFilter: string) {
  let query = supabaseAdmin
    .from('orders')
    .select('id, stripe_customer_id, stripe_price_id, amount_cents, status, created_at')
    .order('created_at', { ascending: false });

  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data: rows } = await query;
  const orders = (rows ?? []) as Omit<Order, 'customer'>[];

  // Customer lookup (deduplicated)
  const custIds = [...new Set(orders.map((o) => o.stripe_customer_id))];
  const { data: custRows } = custIds.length
    ? await supabaseAdmin
        .from('customers')
        .select('stripe_customer_id, email, full_name')
        .in('stripe_customer_id', custIds)
    : { data: [] };

  const custMap = new Map((custRows ?? []).map((c) => [c.stripe_customer_id, c]));

  const enriched: Order[] = orders.map((o) => ({
    ...o,
    status: o.status as OrderStatus,
    customer: custMap.get(o.stripe_customer_id) ?? null,
  }));

  // Revenue from paid orders (regardless of current filter, for the stat card)
  const { data: paidRevRows } = await supabaseAdmin
    .from('orders')
    .select('amount_cents')
    .eq('status', 'paid');

  const totalRevenueCents = (paidRevRows ?? []).reduce(
    (s, r) => s + ((r as { amount_cents: number }).amount_cents ?? 0),
    0,
  );

  return { orders: enriched, totalRevenueCents };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const activeTab = TABS.some((t) => t.value === rawStatus) ? (rawStatus ?? 'all') : 'all';

  const { orders, totalRevenueCents } = await fetchOrders(activeTab);

  return (
    <div className="space-y-6">

      {/* Revenue stat */}
      <div className="inline-block bg-[#13182A] border border-[#1E2538] rounded-xl px-6 py-4">
        <p className="text-[10px] uppercase tracking-widest text-[#5C6378] mb-1.5">Total Revenue (Paid)</p>
        <p className="text-3xl font-bold text-[#F5F5F0] tabular-nums">{fmtAUD(totalRevenueCents)}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#13182A] border border-[#1E2538] rounded-xl p-1 w-fit">
        {TABS.map(({ label, value }) => (
          <Link
            key={value}
            href={value === 'all' ? '/admin/orders' : `/admin/orders?status=${value}`}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === value
                ? 'bg-[#E8963A] text-[#07090F]'
                : 'text-[#9DA3B4] hover:text-[#F5F5F0]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#13182A] border border-[#1E2538] rounded-2xl overflow-hidden">
        {orders.length === 0 ? (
          <p className="text-center text-sm text-[#5C6378] py-16">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2538]">
                  {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#5C6378] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr
                    key={order.id}
                    className={`transition-colors hover:bg-[#0E1220] ${i < orders.length - 1 ? 'border-b border-[#1E2538]' : ''}`}
                  >
                    {/* Order ID */}
                    <td className="px-5 py-3.5 font-mono text-xs text-[#9DA3B4]">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    {/* Customer */}
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-[#F5F5F0] leading-tight">
                        {order.customer?.full_name ?? <span className="text-[#5C6378]">Unknown</span>}
                      </p>
                      <p className="text-xs text-[#9DA3B4] mt-0.5">{order.customer?.email ?? '—'}</p>
                    </td>
                    {/* Product */}
                    <td className="px-5 py-3.5 text-[#9DA3B4]">{tierName(order.stripe_price_id)}</td>
                    {/* Amount */}
                    <td className="px-5 py-3.5 font-medium text-[#F5F5F0] tabular-nums whitespace-nowrap">
                      {fmtAUD(order.amount_cents)}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                    {/* Date */}
                    <td className="px-5 py-3.5 text-[#9DA3B4] tabular-nums whitespace-nowrap text-xs">
                      {fmtDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
