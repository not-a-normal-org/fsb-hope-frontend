import GlassPanel from '@/components/system/GlassPanel';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { User } from '@/payload-types';
import { MyLeadStatusSelect } from './AssignedLeadControls';

interface QueueLead {
  id: string;
  type: string | null;
  route: string | null;
  flight_need: string | null;
  email: string | null;
  whatsapp: string | null;
  phone: string | null;
  points_held: string | null;
  points_budget: string | null;
  status: string;
  created_at: string;
}

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(iso));
}

/**
 * The queue for a searcher or agent: leads assigned to them (`assigned_to` =
 * their Payload user id). They can advance a lead's status from here; the update
 * is ownership-checked server-side. Read via the service-role client, behind the
 * /portal session gate.
 */
export default async function AssignedLeadsDashboard({ user }: { user: User }) {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('id, type, route, flight_need, email, whatsapp, phone, points_held, points_budget, status, created_at')
    .eq('assigned_to', user.id)
    .order('created_at', { ascending: false });

  const leads = (data ?? []) as QueueLead[];
  const openCount = leads.filter((l) => l.status !== 'closed').length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Assigned to you', value: leads.length },
          { label: 'Open', value: openCount },
        ].map((s) => (
          <GlassPanel key={s.label} padding="p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted">{s.label}</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-ink">{s.value}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Queue */}
      <GlassPanel padding="p-0">
        <div className="border-b border-[color:var(--sm-glass-border)] px-6 py-4">
          <h2 className="text-sm font-semibold text-ink">Your queue</h2>
        </div>
        {error ? (
          <p className="px-6 py-10 text-center text-sm" style={{ color: 'var(--sm-error)' }}>
            Couldn’t load your queue: {error.message}
          </p>
        ) : leads.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-ink-muted">
            Nothing assigned to you yet. New work will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--sm-glass-border)]">
                  {['Request', 'Contact', 'Points', 'Status', 'Received'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l, i) => (
                  <tr key={l.id} className={i < leads.length - 1 ? 'border-b border-[color:var(--sm-glass-border)]' : ''}>
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-ink">{l.route || l.flight_need || '—'}</p>
                      <p className="text-xs text-ink-muted capitalize">{l.type ?? 'lead'}</p>
                    </td>
                    <td className="px-6 py-3.5">
                      <p className="text-ink-sub">{l.email ?? '—'}</p>
                      {(l.whatsapp || l.phone) && (
                        <p className="text-xs text-ink-muted">{l.whatsapp ?? l.phone}</p>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-ink-sub">
                      {l.points_held || l.points_budget || <span className="text-ink-muted">—</span>}
                    </td>
                    <td className="px-6 py-3.5">
                      <MyLeadStatusSelect leadId={l.id} current={l.status} />
                    </td>
                    <td className="px-6 py-3.5 text-ink-sub tabular-nums whitespace-nowrap text-xs">
                      {fmtDate(l.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
