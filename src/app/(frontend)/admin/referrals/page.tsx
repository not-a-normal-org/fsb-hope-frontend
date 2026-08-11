import { supabaseAdmin } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/auth';

/**
 * /admin/referrals — read-only attribution view. Admins see every referred lead;
 * an affiliate sees only the leads carrying their own referral code (no customer
 * PII — route/status only). Access is gated by the /admin layout (admin+affiliate).
 */
export const dynamic = 'force-dynamic';

interface Referral {
  id: string;
  type: string | null;
  route: string | null;
  flight_need: string | null;
  status: string;
  referral_code: string | null;
  created_at: string;
}

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(iso),
  );
}

export default async function ReferralsPage() {
  const user = await getCurrentUser();
  const isAffiliate = user?.role === 'affiliate';
  const code = user?.referralCode ?? null;

  let query = supabaseAdmin
    .from('leads')
    .select('id, type, route, flight_need, status, referral_code, created_at')
    .not('referral_code', 'is', null)
    .order('created_at', { ascending: false });

  // Affiliates are scoped to their own code (or nothing if they have none set).
  if (isAffiliate) query = query.eq('referral_code', code ?? '__none__');

  const { data, error } = await query;
  const referrals = (data ?? []) as unknown as Referral[];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4">
        <div className="bg-[#13182A] border border-[#1E2538] rounded-xl px-6 py-4">
          <p className="text-[10px] uppercase tracking-widest text-[#5C6378] mb-1.5">
            {isAffiliate ? 'Your referrals' : 'Total referrals'}
          </p>
          <p className="text-3xl font-bold text-[#F5F5F0] tabular-nums">
            {referrals.length.toLocaleString('en-AU')}
          </p>
        </div>
        {isAffiliate && (
          <div className="bg-[#13182A] border border-[#1E2538] rounded-xl px-6 py-4">
            <p className="text-[10px] uppercase tracking-widest text-[#5C6378] mb-1.5">Your code</p>
            <p className="text-3xl font-bold text-[#E8963A] font-mono tabular-nums">{code ?? '—'}</p>
          </div>
        )}
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
          Failed to load referrals: {error.message}
        </div>
      ) : (
        <div className="bg-[#13182A] border border-[#1E2538] rounded-2xl overflow-hidden">
          {referrals.length === 0 ? (
            <p className="text-center text-sm text-[#5C6378] py-16">
              {isAffiliate && !code
                ? 'No referral code is set on your account yet.'
                : 'No referrals yet.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1E2538]">
                    {['Type', 'Interest', 'Status', ...(!isAffiliate ? ['Code'] : []), 'Received'].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#5C6378] whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {referrals.map((r, i) => (
                    <tr
                      key={r.id}
                      className={`transition-colors hover:bg-[#0E1220] ${
                        i < referrals.length - 1 ? 'border-b border-[#1E2538]' : ''
                      }`}
                    >
                      <td className="px-5 py-3.5 capitalize text-[#9DA3B4]">{r.type ?? 'lead'}</td>
                      <td className="px-5 py-3.5 text-[#9DA3B4]">
                        {r.route || r.flight_need || <span className="text-[#5C6378]">—</span>}
                      </td>
                      <td className="px-5 py-3.5 capitalize text-[#9DA3B4]">{r.status}</td>
                      {!isAffiliate && (
                        <td className="px-5 py-3.5 font-mono text-xs text-[#9DA3B4]">
                          {r.referral_code}
                        </td>
                      )}
                      <td className="px-5 py-3.5 text-[#9DA3B4] tabular-nums whitespace-nowrap text-xs">
                        {fmtDate(r.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
