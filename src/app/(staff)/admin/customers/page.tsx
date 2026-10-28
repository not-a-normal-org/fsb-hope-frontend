import Link from 'next/link';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { tierKeyFromTags } from '@/lib/tiers';
import { TierSelect } from './TierSelect';

// ── Types ─────────────────────────────────────────────────────────────────────

type CustomerStatus = 'pending' | 'approved' | 'active' | 'inactive';

interface Customer {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  business_type: string | null;
  annual_spend_range: string | null;
  tags: string[] | null;
  status: CustomerStatus;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(iso));
}

const STATUS_STYLES: Record<CustomerStatus, string> = {
  active:   'bg-green-500/10  text-green-400  border border-green-500/20',
  approved: 'bg-blue-500/10   text-blue-400   border border-blue-500/20',
  pending:  'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  inactive: 'bg-[#1E2538]     text-[#5C6378]  border border-[#1E2538]',
};

const TABS: { label: string; value: string }[] = [
  { label: 'All',      value: 'all'      },
  { label: 'Active',   value: 'active'   },
  { label: 'Approved', value: 'approved' },
  { label: 'Pending',  value: 'pending'  },
  { label: 'Inactive', value: 'inactive' },
];

function StatusBadge({ status }: { status: CustomerStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-[#1E2538] text-[#5C6378]'}`}>
      {status}
    </span>
  );
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchCustomers(statusFilter: string) {
  let query = supabaseAdmin
    .from('customers')
    .select('id, full_name, email, phone, company_name, business_type, annual_spend_range, tags, status, created_at')
    .order('created_at', { ascending: false });

  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data: rows, error } = await query;

  // Total count is independent of the active filter (for the stat card)
  const { count: totalCount } = await supabaseAdmin
    .from('customers')
    .select('*', { count: 'exact', head: true });

  return {
    customers:  (rows ?? []) as Customer[],
    totalCount: totalCount ?? 0,
    error,
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const activeTab = TABS.some((t) => t.value === rawStatus) ? (rawStatus ?? 'all') : 'all';

  const { customers, totalCount, error } = await fetchCustomers(activeTab);

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
        Failed to load customers: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Total stat */}
      <div className="inline-block bg-[#13182A] border border-[#1E2538] rounded-xl px-6 py-4">
        <p className="text-[10px] uppercase tracking-widest text-[#5C6378] mb-1.5">Total Customers</p>
        <p className="text-3xl font-bold text-[#F5F5F0] tabular-nums">{totalCount.toLocaleString('en-AU')}</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#13182A] border border-[#1E2538] rounded-xl p-1 w-fit">
        {TABS.map(({ label, value }) => (
          <Link
            key={value}
            href={value === 'all' ? '/admin/customers' : `/admin/customers?status=${value}`}
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
        {customers.length === 0 ? (
          <p className="text-center text-sm text-[#5C6378] py-16">No customers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2538]">
                  {['Name', 'Contact', 'Company', 'Tier', 'Annual Spend', 'Status', 'Joined'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#5C6378] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`transition-colors hover:bg-[#0E1220] ${i < customers.length - 1 ? 'border-b border-[#1E2538]' : ''}`}
                  >
                    {/* Name */}
                    <td className="px-5 py-3.5 font-medium text-[#F5F5F0] leading-tight">
                      {c.full_name ?? <span className="text-[#5C6378]">—</span>}
                    </td>
                    {/* Contact */}
                    <td className="px-5 py-3.5">
                      <p className="text-[#9DA3B4] leading-tight">{c.email ?? '—'}</p>
                      <p className="text-xs text-[#5C6378] mt-0.5">{c.phone ?? '—'}</p>
                    </td>
                    {/* Company */}
                    <td className="px-5 py-3.5">
                      <p className="text-[#9DA3B4] leading-tight">
                        {c.company_name ?? <span className="text-[#5C6378]">—</span>}
                      </p>
                      {c.business_type && (
                        <p className="text-xs text-[#5C6378] mt-0.5">{c.business_type}</p>
                      )}
                    </td>
                    {/* Tier */}
                    <td className="px-5 py-3.5">
                      <TierSelect customerId={c.id} current={tierKeyFromTags(c.tags)} />
                    </td>
                    {/* Annual spend */}
                    <td className="px-5 py-3.5 text-[#9DA3B4] whitespace-nowrap">
                      {c.annual_spend_range ?? <span className="text-[#5C6378]">—</span>}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                    {/* Joined */}
                    <td className="px-5 py-3.5 text-[#9DA3B4] tabular-nums whitespace-nowrap text-xs">
                      {fmtDate(c.created_at)}
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
