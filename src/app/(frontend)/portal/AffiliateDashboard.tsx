import GlassPanel from '@/components/system/GlassPanel';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { SITE_URL } from '@/lib/constants';
import type { User } from '@/payload-types';
import CopyButton from './CopyButton';

interface ReferredLead {
  id: string;
  type: string | null;
  route: string | null;
  flight_need: string | null;
  email: string | null;
  status: string | null;
  created_at: string;
}

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

/**
 * Affiliate dashboard: the affiliate's referral link, the leads attributed to
 * their code, and a payouts placeholder. A lead is attributed when a visitor
 * arrives via `?ref=<code>` (stored in the sm_ref cookie by ReferralCapture) and
 * then submits a lead form — the API writes `referral_code` (src/lib/referral.ts).
 * Read via the service-role client; renders only behind the /portal session gate.
 *
 * Follow-ups: a customer-side view once a public apply flow exists, and a real
 * payouts model.
 */
export default async function AffiliateDashboard({ user }: { user: User }) {
  const code = user.referralCode?.trim() || null;

  let referred: ReferredLead[] = [];
  let loadError: string | null = null;

  if (code) {
    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('id, type, route, flight_need, email, status, created_at')
      .eq('referral_code', code)
      .order('created_at', { ascending: false });
    referred = (data ?? []) as ReferredLead[];
    loadError = error?.message ?? null;
  }

  const referralLink = code ? `${SITE_URL}/?ref=${encodeURIComponent(code)}` : null;
  const newCount = referred.filter((l) => l.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Referral link */}
      <GlassPanel padding="p-6 sm:p-8">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ink-muted">
          Your referral link
        </p>
        {code && referralLink ? (
          <>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <code
                className="flex-1 truncate rounded-xl px-4 py-3 text-sm text-ink"
                style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
              >
                {referralLink}
              </code>
              <CopyButton value={referralLink} />
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              Share this link. Anyone who lands through it and submits an enquiry is
              attributed to your code <span className="font-mono text-ink-sub">{code}</span>.
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-ink-sub">
            You don’t have a referral code yet. Ask an admin to assign one to your
            account, and your link will appear here.
          </p>
        )}
      </GlassPanel>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Referred leads', value: referred.length },
          { label: 'New', value: newCount },
        ].map((s) => (
          <GlassPanel key={s.label} padding="p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted">
              {s.label}
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-ink">{s.value}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Referred leads table */}
      <GlassPanel padding="p-0">
        <div className="border-b border-[color:var(--sm-glass-border)] px-6 py-4">
          <h2 className="text-sm font-semibold text-ink">Referred leads</h2>
        </div>
        {loadError ? (
          <p className="px-6 py-10 text-center text-sm" style={{ color: 'var(--sm-error)' }}>
            Couldn’t load referrals: {loadError}
          </p>
        ) : referred.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-ink-muted">
            {code
              ? 'No referred leads yet. Share your link to get started.'
              : 'A referral code is needed before leads can be attributed to you.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--sm-glass-border)]">
                  {['Lead', 'Interest', 'Status', 'Date'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {referred.map((l, i) => (
                  <tr
                    key={l.id}
                    className={i < referred.length - 1 ? 'border-b border-[color:var(--sm-glass-border)]' : ''}
                  >
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-ink">{l.email ?? '—'}</p>
                      <p className="text-xs text-ink-muted capitalize">{l.type ?? 'lead'}</p>
                    </td>
                    <td className="px-6 py-3.5 text-ink-sub">
                      {l.route || l.flight_need || '—'}
                    </td>
                    <td className="px-6 py-3.5 text-ink-sub capitalize">{l.status ?? 'new'}</td>
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

      {/* Payouts placeholder */}
      <GlassPanel padding="p-6 sm:p-8">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-ink-muted">Payouts</p>
        <p className="mt-2 text-sm text-ink-sub">
          Commission and payout tracking is coming soon.
        </p>
      </GlassPanel>
    </div>
  );
}
