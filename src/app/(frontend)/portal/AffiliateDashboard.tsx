import GlassPanel from '@/components/system/GlassPanel';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { SITE_URL } from '@/lib/constants';
import { CUSTOMER_TIERS, tierKeyFromTags } from '@/lib/tiers';
import type { User } from '@/payload-types';
import CopyButton from './CopyButton';

interface ReferredCustomer {
  id: string;
  full_name: string | null;
  email: string | null;
  tags: string[] | null;
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

function tierLabel(tags: string[] | null): string {
  const key = tierKeyFromTags(tags);
  return CUSTOMER_TIERS.find((t) => t.key === key)?.label ?? '—';
}

/**
 * Affiliate dashboard: the affiliate's referral link, the clients attributed to
 * their code, and a payouts placeholder. Referred clients are `customers` whose
 * `tags` include the affiliate's referralCode (the apply flow stores the
 * referral source there). Read via the service-role client; this component only
 * renders behind the /portal layout's session gate.
 *
 * Follow-ups: capturing `?ref=<code>` on the public site into that tag
 * (attribution), and a real payouts model.
 */
export default async function AffiliateDashboard({ user }: { user: User }) {
  const code = user.referralCode?.trim() || null;

  let referred: ReferredCustomer[] = [];
  let loadError: string | null = null;

  if (code) {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select('id, full_name, email, tags, status, created_at')
      .contains('tags', [code])
      .order('created_at', { ascending: false });
    referred = (data ?? []) as ReferredCustomer[];
    loadError = error?.message ?? null;
  }

  const referralLink = code ? `${SITE_URL}/?ref=${encodeURIComponent(code)}` : null;
  const activeCount = referred.filter((c) => c.status === 'active').length;

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
              <code className="flex-1 truncate rounded-xl px-4 py-3 text-sm text-ink" style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}>
                {referralLink}
              </code>
              <CopyButton value={referralLink} />
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              Share this link. Clients who apply through it are attributed to your
              code <span className="font-mono text-ink-sub">{code}</span>.
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
          { label: 'Referred clients', value: referred.length },
          { label: 'Active', value: activeCount },
        ].map((s) => (
          <GlassPanel key={s.label} padding="p-5">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted">
              {s.label}
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-ink">{s.value}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Referred clients table */}
      <GlassPanel padding="p-0">
        <div className="border-b border-[color:var(--sm-glass-border)] px-6 py-4">
          <h2 className="text-sm font-semibold text-ink">Referred clients</h2>
        </div>
        {loadError ? (
          <p className="px-6 py-10 text-center text-sm" style={{ color: 'var(--sm-error)' }}>
            Couldn’t load referrals: {loadError}
          </p>
        ) : referred.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-ink-muted">
            {code
              ? 'No referred clients yet. Share your link to get started.'
              : 'A referral code is needed before clients can be attributed to you.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--sm-glass-border)]">
                  {['Client', 'Tier', 'Status', 'Joined'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {referred.map((c, i) => (
                  <tr key={c.id} className={i < referred.length - 1 ? 'border-b border-[color:var(--sm-glass-border)]' : ''}>
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-ink">{c.full_name ?? '—'}</p>
                      <p className="text-xs text-ink-muted">{c.email ?? '—'}</p>
                    </td>
                    <td className="px-6 py-3.5 text-ink-sub">{tierLabel(c.tags)}</td>
                    <td className="px-6 py-3.5 text-ink-sub capitalize">{c.status ?? '—'}</td>
                    <td className="px-6 py-3.5 text-ink-sub tabular-nums whitespace-nowrap text-xs">
                      {fmtDate(c.created_at)}
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
