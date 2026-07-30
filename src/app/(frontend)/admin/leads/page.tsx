import Link from 'next/link';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { getPayloadClient } from '@/lib/payload';
import { AssigneeSelect, StatusSelect, type Account } from './LeadRowControls';

export const dynamic = 'force-dynamic';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Lead {
  id: string;
  type: string | null;
  route: string | null;
  flight_need: string | null;
  email: string | null;
  whatsapp: string | null;
  phone: string | null;
  status: string;
  referral_code: string | null;
  assigned_to: number | null;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(iso));
}

const TABS: { label: string; value: string }[] = [
  { label: 'All',        value: 'all' },
  { label: 'New',        value: 'new' },
  { label: 'Contacted',  value: 'contacted' },
  { label: 'Searching',  value: 'searching' },
  { label: 'Closed',     value: 'closed' },
];

const TYPE_STYLES: Record<string, string> = {
  individual: 'bg-blue-500/10   text-blue-400   border border-blue-500/20',
  business:   'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  contact:    'bg-[#1E2538]     text-[#9DA3B4]  border border-[#1E2538]',
};

function TypeBadge({ type }: { type: string | null }) {
  const t = type ?? 'lead';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${TYPE_STYLES[t] ?? TYPE_STYLES.contact}`}>
      {t}
    </span>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

async function fetchLeads(statusFilter: string) {
  let query = supabaseAdmin
    .from('leads')
    .select('id, type, route, flight_need, email, whatsapp, phone, status, referral_code, assigned_to, created_at')
    .order('created_at', { ascending: false });

  if (statusFilter !== 'all') query = query.eq('status', statusFilter);

  const { data: rows, error } = await query;

  const { count: totalCount } = await supabaseAdmin
    .from('leads')
    .select('*', { count: 'exact', head: true });

  return { leads: (rows ?? []) as Lead[], totalCount: totalCount ?? 0, error };
}

async function fetchAssignableAccounts(): Promise<Account[]> {
  const payload = await getPayloadClient();
  const { docs } = await payload.find({
    collection: 'users',
    where: { and: [{ role: { in: ['searcher', 'agent'] } }, { status: { equals: 'active' } }] },
    limit: 200,
    sort: 'name',
    depth: 0,
  });
  return docs.map((d) => ({ id: d.id, name: d.name, role: d.role }));
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const activeTab = TABS.some((t) => t.value === rawStatus) ? (rawStatus ?? 'all') : 'all';

  const [{ leads, totalCount, error }, accounts] = await Promise.all([
    fetchLeads(activeTab),
    fetchAssignableAccounts(),
  ]);

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
        Failed to load leads: {error.message}
      </div>
    );
  }

  const unassigned = leads.filter((l) => l.assigned_to == null).length;

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="flex flex-wrap gap-4">
        <div className="bg-[#13182A] border border-[#1E2538] rounded-xl px-6 py-4">
          <p className="text-[10px] uppercase tracking-widest text-[#5C6378] mb-1.5">Total Leads</p>
          <p className="text-3xl font-bold text-[#F5F5F0] tabular-nums">{totalCount.toLocaleString('en-AU')}</p>
        </div>
        <div className="bg-[#13182A] border border-[#1E2538] rounded-xl px-6 py-4">
          <p className="text-[10px] uppercase tracking-widest text-[#5C6378] mb-1.5">Unassigned (this view)</p>
          <p className="text-3xl font-bold text-[#F5F5F0] tabular-nums">{unassigned.toLocaleString('en-AU')}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#13182A] border border-[#1E2538] rounded-xl p-1 w-fit">
        {TABS.map(({ label, value }) => (
          <Link
            key={value}
            href={value === 'all' ? '/admin/leads' : `/admin/leads?status=${value}`}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === value ? 'bg-[#E8963A] text-[#07090F]' : 'text-[#9DA3B4] hover:text-[#F5F5F0]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-3 text-sm text-yellow-400">
          No active searcher or agent accounts yet — create some in{' '}
          <Link href="/admin/team" className="underline">Team</Link> to assign leads.
        </div>
      )}

      {/* Table */}
      <div className="bg-[#13182A] border border-[#1E2538] rounded-2xl overflow-hidden">
        {leads.length === 0 ? (
          <p className="text-center text-sm text-[#5C6378] py-16">No leads found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2538]">
                  {['Lead', 'Interest', 'Referral', 'Assignee', 'Status', 'Received'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#5C6378] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l, i) => (
                  <tr key={l.id} className={`transition-colors hover:bg-[#0E1220] ${i < leads.length - 1 ? 'border-b border-[#1E2538]' : ''}`}>
                    {/* Lead */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#F5F5F0] leading-tight">{l.email ?? '—'}</span>
                        <TypeBadge type={l.type} />
                      </div>
                      {(l.whatsapp || l.phone) && (
                        <p className="text-xs text-[#5C6378] mt-0.5">{l.whatsapp ?? l.phone}</p>
                      )}
                    </td>
                    {/* Interest */}
                    <td className="px-5 py-3.5 text-[#9DA3B4]">
                      {l.route || l.flight_need || <span className="text-[#5C6378]">—</span>}
                    </td>
                    {/* Referral */}
                    <td className="px-5 py-3.5">
                      {l.referral_code
                        ? <span className="font-mono text-xs text-[#9DA3B4]">{l.referral_code}</span>
                        : <span className="text-[#5C6378]">—</span>}
                    </td>
                    {/* Assignee */}
                    <td className="px-5 py-3.5">
                      <AssigneeSelect leadId={l.id} current={l.assigned_to} accounts={accounts} />
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5">
                      <StatusSelect leadId={l.id} current={l.status} />
                    </td>
                    {/* Received */}
                    <td className="px-5 py-3.5 text-[#9DA3B4] tabular-nums whitespace-nowrap text-xs">
                      {fmtDate(l.created_at)}
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
