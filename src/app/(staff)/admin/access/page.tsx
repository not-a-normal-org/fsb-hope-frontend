import { headers } from 'next/headers';

import { supabaseAdmin } from '@/lib/supabase/admin';
import {
  ALLOWLIST_TTL_MS,
  BLOCKED_COUNTRIES,
  REGION_BLOCK_ENABLED,
  buildAllowlist,
  clientIp,
  countryOf,
  isAllowed,
  isBlockedCountry,
} from '@/lib/region-block';
import { AllowlistClient, type AllowlistRow } from './AllowlistClient';

/**
 * /admin/access — the region block's allowlist (admin-only; see ADMIN_NAV).
 * Shows whether the block is on, what this connection looks like to it, and the
 * allowlisted addresses, with add/remove. The block itself is src/proxy.ts.
 */
export const dynamic = 'force-dynamic';

const card = 'bg-[#13182A] border border-[#1E2538] rounded-2xl';
const label = 'text-[10px] uppercase tracking-widest text-[#5C6378]';

export default async function AccessPage() {
  const h = await headers();
  const ip = clientIp(h);
  const country = countryOf(h);

  const { data, error } = await supabaseAdmin
    .from('ip_allowlist')
    .select('id, cidr, label, created_by, created_at')
    .order('created_at', { ascending: false });
  const rows = (data ?? []) as AllowlistRow[];

  // The entry (if any) that lets this connection in — shown, and marked in the table.
  const myEntry = ip ? rows.find((r) => isAllowed(buildAllowlist([r.cidr]), ip)) : undefined;
  const countries = [...BLOCKED_COUNTRIES.values()];
  const blockedHere = isBlockedCountry(country);

  return (
    <div className="space-y-6">
      {/* Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className={`${card} p-5`}>
          <p className={label}>Region block</p>
          {REGION_BLOCK_ENABLED ? (
            <>
              <p className="mt-2 text-lg font-semibold text-[#F5F5F0]">On</p>
              <p className="mt-1 text-sm text-[#9DA3B4]">
                Visitors in {countries.slice(0, -1).join(', ')} and {countries.at(-1)} see a
                &ldquo;Not available in your region&rdquo; page, unless their IP address is on the
                list below.
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-lg font-semibold text-[#E8963A]">Off</p>
              <p className="mt-1 text-sm text-[#9DA3B4]">
                <code className="text-[#F5F5F0]">REGION_BLOCK=off</code> is set in the environment,
                so nobody is blocked. Remove it and redeploy to turn the block back on.
              </p>
            </>
          )}
        </div>

        <div className={`${card} p-5`}>
          <p className={label}>Your connection</p>
          <p className="mt-2 font-mono text-lg text-[#F5F5F0]">{ip ?? 'Unknown'}</p>
          <p className="mt-1 text-sm text-[#9DA3B4]">
            {country
              ? `Located in ${BLOCKED_COUNTRIES.get(country) ?? country}${blockedHere ? ' — a blocked region.' : '.'}`
              : 'No location (normal when running locally).'}{' '}
            {blockedHere &&
              (myEntry
                ? `Your address is on the list (${myEntry.cidr}), so you get in signed out too.`
                : 'You get in because you’re signed in. Signed out, you would be blocked.')}
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Could not read the allowlist: {error.message}
        </p>
      )}

      <AllowlistClient rows={rows} currentIp={ip} myEntryId={myEntry?.id ?? null} />

      <div className={`${card} space-y-2 p-5 text-sm text-[#9DA3B4]`}>
        <p className={label}>How it works</p>
        <p>Changes reach every server within about {Math.round(ALLOWLIST_TTL_MS / 1000)} seconds.</p>
        <p>
          Signed-in staff are never blocked, and the staff sign-in pages stay open in every region,
          so if your address changes you can still sign in and add the new one here.
        </p>
        <p>
          Home and mobile connections often get a new IPv4 address from time to time. For IPv6, add
          the <span className="font-mono text-[#F5F5F0]">/64</span> range your connection uses,
          because the address inside it changes on its own.
        </p>
      </div>
    </div>
  );
}
