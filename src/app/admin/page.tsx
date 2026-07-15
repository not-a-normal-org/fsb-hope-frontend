import { supabaseAdmin } from '@/lib/supabase/admin';

// ── Types ─────────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
}

interface RecentCustomer {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

// ── Components ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="bg-[#0E1220] border border-[#1E2538] rounded-2xl px-6 py-5">
      <p className="text-xs font-medium uppercase tracking-widest text-[#5C6378] mb-3">{label}</p>
      <p className="text-3xl font-bold text-[#F5F5F0] tabular-nums">{value}</p>
      {sub && <p className="mt-1 text-xs text-[#9DA3B4]">{sub}</p>}
    </div>
  );
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchStats() {
  const [
    { count: totalCustomers },
    { count: activeSubscriptions },
    { count: totalOrders },
    { data: revenueData },
    { count: newsletterSubscribers },
    { data: recentCustomers },
  ] = await Promise.all([
    supabaseAdmin
      .from('customers')
      .select('*', { count: 'exact', head: true }),

    supabaseAdmin
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),

    supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'paid'),

    supabaseAdmin
      .from('orders')
      .select('amount_cents')
      .eq('status', 'paid'),

    supabaseAdmin
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true),

    supabaseAdmin
      .from('customers')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const totalRevenueCents =
    (revenueData ?? []).reduce(
      (sum, row) => sum + ((row as { amount_cents: number }).amount_cents ?? 0),
      0,
    );

  return {
    totalCustomers:        totalCustomers       ?? 0,
    activeSubscriptions:   activeSubscriptions  ?? 0,
    totalOrders:           totalOrders          ?? 0,
    totalRevenueCents,
    newsletterSubscribers: newsletterSubscribers ?? 0,
    recentCustomers:       (recentCustomers ?? []) as RecentCustomer[],
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRevenue(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  }).format(new Date(iso));
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const {
    totalCustomers,
    activeSubscriptions,
    totalOrders,
    totalRevenueCents,
    newsletterSubscribers,
    recentCustomers,
  } = await fetchStats();

  return (
    <div className="space-y-8">

      {/* Stats grid */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#5C6378] mb-4">
          Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <StatCard
            label="Total Customers"
            value={totalCustomers.toLocaleString('en-AU')}
          />
          <StatCard
            label="Active Subscriptions"
            value={activeSubscriptions.toLocaleString('en-AU')}
          />
          <StatCard
            label="Paid Orders"
            value={totalOrders.toLocaleString('en-AU')}
          />
          <StatCard
            label="Total Revenue"
            value={formatRevenue(totalRevenueCents)}
            sub="from paid orders"
          />
          <StatCard
            label="Newsletter"
            value={newsletterSubscribers.toLocaleString('en-AU')}
            sub="active subscribers"
          />
        </div>
      </section>

      {/* Recent customers */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#5C6378] mb-4">
          Recent Customers
        </h2>
        <div className="bg-[#0E1220] border border-[#1E2538] rounded-2xl overflow-hidden">
          {recentCustomers.length === 0 ? (
            <p className="px-6 py-10 text-sm text-center text-[#5C6378]">No customers yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2538]">
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#5C6378]">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#5C6378]">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-widest text-[#5C6378]">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentCustomers.map((customer, i) => (
                  <tr
                    key={customer.id}
                    className={`
                      transition-colors hover:bg-[#13182A]
                      ${i < recentCustomers.length - 1 ? 'border-b border-[#1E2538]' : ''}
                    `}
                  >
                    <td className="px-6 py-3.5 text-[#F5F5F0] font-medium">
                      {customer.full_name ?? <span className="text-[#5C6378]">—</span>}
                    </td>
                    <td className="px-6 py-3.5 text-[#9DA3B4]">
                      {customer.email ?? <span className="text-[#5C6378]">—</span>}
                    </td>
                    <td className="px-6 py-3.5 text-[#9DA3B4] tabular-nums">
                      {formatDate(customer.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

    </div>
  );
}
