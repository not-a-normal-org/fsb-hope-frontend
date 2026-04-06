'use client';

import { useEffect, useState, useTransition } from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { approveApplication, rejectApplication } from './actions';

// ── Types ─────────────────────────────────────────────────────────────────────

type AppStatus = 'pending' | 'active' | 'approved' | 'inactive';

interface Customer {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  company_name: string | null;
  business_type: string | null;
  annual_spend_range: string | null;
  tags: string[] | null;
  status: AppStatus;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  stripe_price_id: string | null;
  price_cents: number;
  billing_interval: string | null;
  type: 'subscription' | 'one_off';
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
}

function fmtAUD(cents: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(cents / 100);
}

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-yellow-500/10 text-yellow-400  border border-yellow-500/20',
  active:   'bg-green-500/10  text-green-400   border border-green-500/20',
  approved: 'bg-blue-500/10   text-blue-400    border border-blue-500/20',
  inactive: 'bg-[#1E2538]     text-[#5C6378]   border border-[#1E2538]',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.inactive}`}>
      {status}
    </span>
  );
}

// ── Approve inline panel ──────────────────────────────────────────────────────

function ApprovePanel({
  customer,
  products,
  onClose,
}: {
  customer: Customer;
  products: Product[];
  onClose: () => void;
}) {
  const [selectedPriceId, setSelectedPriceId] = useState(products[0]?.stripe_price_id ?? '');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const tier = customer.tags?.[0] ?? 'Explore';

  function handleSend() {
    if (!selectedPriceId) { setError('Please select a product.'); return; }
    if (!customer.email)  { setError('Customer has no email on file.'); return; }
    setError('');
    startTransition(async () => {
      try {
        await approveApplication(customer.id, selectedPriceId, customer.email!, customer.full_name ?? 'Member', tier);
        onClose();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Something went wrong.');
      }
    });
  }

  return (
    <div className="mt-3 bg-[#07090F] border border-[#1E2538] rounded-xl p-4 space-y-3">
      <p className="text-xs text-[#9DA3B4] font-medium">Select product to charge:</p>

      <div className="relative">
        <select
          className="w-full bg-[#13182A] border border-[#1E2538] text-white rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:border-[#E8963A] transition-colors"
          value={selectedPriceId}
          onChange={e => setSelectedPriceId(e.target.value)}
        >
          {products.map(p => (
            <option key={p.id} value={p.stripe_price_id ?? ''} className="bg-[#13182A]">
              {p.name} — {fmtAUD(p.price_cents)}{p.billing_interval ? `/${p.billing_interval}` : ''}
            </option>
          ))}
        </select>
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C6378] pointer-events-none" />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          onClick={handleSend}
          disabled={isPending}
          className="flex items-center gap-1.5 bg-[#E8963A] hover:bg-[#F2AA5E] disabled:opacity-50 text-[#07090F] font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
        >
          {isPending && <Loader2 size={12} className="animate-spin" />}
          {isPending ? 'Sending…' : 'Send Payment Link'}
        </button>
        <button
          onClick={onClose}
          className="text-xs text-[#9DA3B4] hover:text-white px-3 py-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Row component ─────────────────────────────────────────────────────────────

function ApplicationRow({
  customer,
  products,
  isLast,
}: {
  customer: Customer;
  products: Product[];
  isLast: boolean;
}) {
  const [showApprove, setShowApprove] = useState(false);
  const [isPending, startTransition]  = useTransition();
  const [rejectError, setRejectError] = useState('');

  const tier = customer.tags?.[0] ?? '—';
  const isPendingStatus = customer.status === 'pending';

  function handleReject() {
    if (!customer.email) return;
    setRejectError('');
    startTransition(async () => {
      try {
        await rejectApplication(customer.id, customer.email!, customer.full_name ?? 'Applicant');
      } catch (e) {
        setRejectError(e instanceof Error ? e.message : 'Failed to reject.');
      }
    });
  }

  return (
    <>
      <tr className={`transition-colors hover:bg-[#0E1220] ${!isLast ? 'border-b border-[#1E2538]' : ''}`}>
        {/* Name + Company */}
        <td className="px-5 py-3.5">
          <p className="font-medium text-[#F5F5F0] leading-tight">{customer.full_name ?? '—'}</p>
          <p className="text-xs text-[#9DA3B4] mt-0.5">{customer.company_name ?? '—'}</p>
        </td>
        {/* Email + Phone */}
        <td className="px-5 py-3.5">
          <p className="text-sm text-[#F5F5F0] leading-tight">{customer.email ?? '—'}</p>
          <p className="text-xs text-[#9DA3B4] mt-0.5">{customer.phone ?? '—'}</p>
        </td>
        {/* Tier */}
        <td className="px-5 py-3.5">
          <span className="text-sm text-[#F5F5F0] capitalize">{tier}</span>
        </td>
        {/* Spend */}
        <td className="px-5 py-3.5 text-sm text-[#9DA3B4] whitespace-nowrap">
          {customer.annual_spend_range ?? '—'}
        </td>
        {/* Date */}
        <td className="px-5 py-3.5 text-sm text-[#9DA3B4] whitespace-nowrap tabular-nums">
          {fmtDate(customer.created_at)}
        </td>
        {/* Status */}
        <td className="px-5 py-3.5">
          <StatusBadge status={customer.status} />
        </td>
        {/* Actions */}
        <td className="px-5 py-3.5 text-right">
          {isPendingStatus && (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowApprove(v => !v)}
                className="text-xs bg-[#E8963A]/10 hover:bg-[#E8963A]/20 text-[#E8963A] border border-[#E8963A]/20 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Approve &amp; Send Link
              </button>
              <button
                onClick={handleReject}
                disabled={isPending}
                className="text-xs text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400/40 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {isPending ? <Loader2 size={11} className="animate-spin" /> : 'Reject'}
              </button>
            </div>
          )}
          {rejectError && <p className="text-xs text-red-400 mt-1 text-right">{rejectError}</p>}
        </td>
      </tr>

      {/* Inline approve panel */}
      {showApprove && (
        <tr className={!isLast ? 'border-b border-[#1E2538]' : ''}>
          <td colSpan={7} className="px-5 pb-4">
            <ApprovePanel
              customer={customer}
              products={products}
              onClose={() => setShowApprove(false)}
            />
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main page (client component) ──────────────────────────────────────────────

export default function ApplicationsPage() {
  const [tab, setTab]               = useState<'pending' | 'all'>('pending');
  const [customers, setCustomers]   = useState<Customer[]>([]);
  const [products, setProducts]     = useState<Product[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [custRes, prodRes] = await Promise.all([
          fetch('/api/admin/applications-data'),
          fetch('/api/admin/products-data'),
        ]);
        if (!custRes.ok || !prodRes.ok) throw new Error('Failed to load data');
        const [custData, prodData] = await Promise.all([custRes.json(), prodRes.json()]);
        setCustomers(custData.customers ?? []);
        setProducts(prodData.products ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pendingCount = customers.filter(c => c.status === 'pending').length;
  const displayed    = tab === 'pending'
    ? customers.filter(c => c.status === 'pending')
    : customers;

  return (
    <div className="space-y-6">

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Review', value: loading ? '—' : customers.filter(c => c.status === 'pending').length.toString() },
          { label: 'Approved',       value: loading ? '—' : customers.filter(c => c.status === 'approved').length.toString() },
          { label: 'Total',          value: loading ? '—' : customers.length.toString() },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#13182A] border border-[#1E2538] rounded-xl px-5 py-4">
            <p className="text-[10px] uppercase tracking-widest text-[#5C6378] mb-1.5">{label}</p>
            <p className="text-2xl font-bold text-[#F5F5F0] tabular-nums">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#0E1220] border border-[#1E2538] rounded-xl p-1 w-fit">
        {([['pending', 'Pending Review'], ['all', 'All Applications']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-[#13182A] text-[#F5F5F0]'
                : 'text-[#5C6378] hover:text-[#9DA3B4]'
            }`}
          >
            {label}
            {key === 'pending' && pendingCount > 0 && (
              <span className="ml-2 text-[10px] bg-[#E8963A]/20 text-[#E8963A] px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#13182A] border border-[#1E2538] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-[#5C6378] text-sm">
            <Loader2 size={16} className="animate-spin" />
            Loading…
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-400 py-16">{error}</p>
        ) : displayed.length === 0 ? (
          <p className="text-center text-sm text-[#5C6378] py-16">
            {tab === 'pending' ? 'No pending applications.' : 'No applications yet.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2538]">
                  {['Name / Company', 'Email / Phone', 'Tier', 'Annual Spend', 'Applied', 'Status', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#5C6378] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map((customer, i) => (
                  <ApplicationRow
                    key={customer.id}
                    customer={customer}
                    products={products}
                    isLast={i === displayed.length - 1}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
