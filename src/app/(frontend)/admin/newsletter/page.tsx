import { supabaseAdmin } from '@/lib/supabase/admin';
import { ExportCSVButton } from './ExportCSVButton';
import { unsubscribeUser } from './actions';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Subscriber {
  id: string;
  email: string;
  full_name: string | null;
  source: string | null;
  is_active: boolean;
  created_at: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(iso));
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function NewsletterPage() {
  const { data: rows } = await supabaseAdmin
    .from('newsletter_subscribers')
    .select('id, email, full_name, source, is_active, created_at')
    .order('created_at', { ascending: false, nullsFirst: false });

  const subscribers = (rows ?? []) as Subscriber[];
  const activeCount  = subscribers.filter((s) => s.is_active).length;
  const totalCount   = subscribers.length;

  // Active subscribers passed to CSV export (client component)
  const activeSubscribers = subscribers
    .filter((s) => s.is_active)
    .map((s) => ({
      email:         s.email,
      full_name:     s.full_name,
      subscribed_at: s.created_at,
    }));

  return (
    <div className="space-y-6">

      {/* Stats + actions row */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex gap-4">
          {[
            { label: 'Total',  value: totalCount.toLocaleString('en-AU')  },
            { label: 'Active', value: activeCount.toLocaleString('en-AU') },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#13182A] border border-[#1E2538] rounded-xl px-5 py-4 min-w-[120px]">
              <p className="text-[10px] uppercase tracking-widest text-[#5C6378] mb-1.5">{label}</p>
              <p className="text-2xl font-bold text-[#F5F5F0] tabular-nums">{value}</p>
            </div>
          ))}
        </div>

        {/* CSV export — client component */}
        <ExportCSVButton subscribers={activeSubscribers} />
      </div>

      {/* Table */}
      <div className="bg-[#13182A] border border-[#1E2538] rounded-2xl overflow-hidden">
        {subscribers.length === 0 ? (
          <p className="text-center text-sm text-[#5C6378] py-16">No subscribers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2538]">
                  {['Email', 'Name', 'Source', 'Subscribed', 'Status', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#5C6378] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub, i) => {
                  const unsubscribeAction = unsubscribeUser.bind(null, sub.id);

                  return (
                    <tr
                      key={sub.id}
                      className={`transition-colors hover:bg-[#0E1220] ${i < subscribers.length - 1 ? 'border-b border-[#1E2538]' : ''}`}
                    >
                      {/* Email */}
                      <td className="px-5 py-3.5 text-[#F5F5F0] font-medium">{sub.email}</td>
                      {/* Name */}
                      <td className="px-5 py-3.5 text-[#9DA3B4]">
                        {sub.full_name ?? <span className="text-[#5C6378]">—</span>}
                      </td>
                      {/* Source */}
                      <td className="px-5 py-3.5 text-[#9DA3B4]">
                        {sub.source ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#0E1220] border border-[#1E2538] text-[#9DA3B4]">
                            {sub.source}
                          </span>
                        ) : (
                          <span className="text-[#5C6378]">—</span>
                        )}
                      </td>
                      {/* Subscribed date */}
                      <td className="px-5 py-3.5 text-[#9DA3B4] tabular-nums whitespace-nowrap text-xs">
                        {fmtDate(sub.created_at)}
                      </td>
                      {/* Active badge */}
                      <td className="px-5 py-3.5">
                        {sub.is_active ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#1E2538] text-[#5C6378] border border-[#1E2538]">
                            Unsubscribed
                          </span>
                        )}
                      </td>
                      {/* Unsubscribe action */}
                      <td className="px-5 py-3.5 text-right">
                        {sub.is_active && (
                          <form action={unsubscribeAction}>
                            <button
                              type="submit"
                              className="text-xs text-[#9DA3B4] hover:text-red-400 border border-[#1E2538] hover:border-red-500/30 px-3 py-1 rounded-lg transition-colors"
                            >
                              Unsubscribe
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
