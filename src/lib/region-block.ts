import { BlockList, isIP } from 'node:net';

/**
 * Region block — the public site is not served to visitors located in the Indian
 * subcontinent, except from IP addresses on an allowlist that admins manage at
 * /admin/access (table `public.ip_allowlist`, see docs/sql/ip_allowlist.sql).
 *
 * Enforced in `src/proxy.ts`, which runs on the Node.js runtime in Next 16, so
 * `node:net` is available there. No `server-only` import: the proxy is not a
 * React Server Components bundle and that package would throw in it.
 *
 * Who is never blocked, so the team can't lock itself out when an ISP hands it a
 * new address: signed-in staff (any active `payload-token` session), and the
 * staff sign-in screens. Those are exempted in the proxy, not here.
 *
 * Location comes from Vercel's `x-vercel-ip-country` and the address from
 * `x-real-ip`. Vercel sets both at its edge and overwrites anything the client
 * sends, so neither can be spoofed in production. Locally neither is set, so
 * nothing is blocked in development.
 */

/** ISO 3166-1 alpha-2 code → name, for the admin page. */
export const BLOCKED_COUNTRIES: ReadonlyMap<string, string> = new Map([
  ['IN', 'India'],
  ['PK', 'Pakistan'],
  ['BD', 'Bangladesh'],
  ['LK', 'Sri Lanka'],
  ['NP', 'Nepal'],
  ['BT', 'Bhutan'],
  ['MV', 'Maldives'],
]);

/** Kill switch: `REGION_BLOCK=off` in the environment turns the block off. */
export const REGION_BLOCK_ENABLED = process.env.REGION_BLOCK !== 'off';

type HeaderSource = { get(name: string): string | null };

/** The visitor's country as Vercel geolocated it, upper-cased, or null. */
export function countryOf(headers: HeaderSource): string | null {
  return headers.get('x-vercel-ip-country')?.trim().toUpperCase() || null;
}

export function isBlockedCountry(country: string | null): boolean {
  return !!country && BLOCKED_COUNTRIES.has(country);
}

/** An IPv4 address written as IPv6 (`::ffff:203.0.113.5`) is the IPv4 address. */
function unmapIp(ip: string): string {
  const m = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(ip);
  return m ? m[1] : ip;
}

/** The client's IP address, or null when the request carries none (local dev). */
export function clientIp(headers: HeaderSource): string | null {
  const raw = headers.get('x-real-ip') ?? headers.get('x-forwarded-for')?.split(',')[0] ?? '';
  const ip = unmapIp(raw.trim());
  return isIP(ip) ? ip : null;
}

export type EntryResult = { ok: true; cidr: string } | { ok: false; error: string };

/**
 * Validate an allowlist entry typed by an admin: a single address (`203.0.113.5`,
 * `2001:db8::1`) or a range (`203.0.113.0/24`, `2001:db8:1:2::/64`). Returns it
 * as `address/prefix`, so a single address is stored as /32 (IPv4) or /128 (IPv6).
 */
export function normalizeEntry(input: string): EntryResult {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return { ok: false, error: 'Enter an IP address or range.' };

  const [rawAddress, rawPrefix, extra] = trimmed.split('/');
  const address = unmapIp(rawAddress);
  const family = isIP(address);
  if (extra !== undefined || family === 0) {
    return { ok: false, error: `“${input.trim()}” is not an IP address or range.` };
  }

  const max = family === 4 ? 32 : 128;
  if (rawPrefix === undefined) return { ok: true, cidr: `${address}/${max}` };
  if (!/^\d{1,3}$/.test(rawPrefix) || Number(rawPrefix) > max) {
    return { ok: false, error: `The range size after “/” must be 0–${max} for this address.` };
  }
  // A short prefix lets a whole region back in, which defeats the block. /16 for
  // IPv4 and /32 for IPv6 are already provider-sized; refuse anything wider.
  const min = family === 4 ? 16 : 32;
  if (Number(rawPrefix) < min) {
    return { ok: false, error: `That range is too wide — use /${min} or narrower.` };
  }
  return { ok: true, cidr: `${address}/${Number(rawPrefix)}` };
}

/** A matcher over allowlist entries. Entries that don't parse are skipped. */
export function buildAllowlist(cidrs: readonly string[]): BlockList {
  const list = new BlockList();
  for (const cidr of cidrs) {
    const [address, prefix] = cidr.split('/');
    const family = isIP(address);
    if (family === 0) continue;
    const bits = prefix === undefined ? (family === 4 ? 32 : 128) : Number(prefix);
    try {
      list.addSubnet(address, bits, family === 4 ? 'ipv4' : 'ipv6');
    } catch {
      // Malformed row — never let one bad entry take the whole list down.
    }
  }
  return list;
}

export function isAllowed(list: BlockList, ip: string): boolean {
  const address = unmapIp(ip);
  const family = isIP(address);
  if (family === 0) return false;
  return list.check(address, family === 4 ? 'ipv4' : 'ipv6');
}

// ── The live allowlist, as the proxy reads it ────────────────────────────────

/** How long an instance trusts its copy. Admin changes take effect within this. */
export const ALLOWLIST_TTL_MS = 30_000;
/** After a failed read, wait this long before trying the database again. */
const RETRY_AFTER_FAILURE_MS = 5_000;

let cached: { list: BlockList; expires: number } | null = null;
let inflight: Promise<BlockList> | null = null;

async function fetchAllowlist(): Promise<BlockList> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase URL or service-role key is not set');
  // PostgREST directly rather than supabase-js, to keep the proxy bundle small.
  const res = await fetch(`${url}/rest/v1/ip_allowlist?select=cidr`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(2_000),
  });
  if (!res.ok) throw new Error(`allowlist read failed: HTTP ${res.status}`);
  const rows = (await res.json()) as { cidr: string }[];
  return buildAllowlist(rows.map((r) => r.cidr));
}

/**
 * Whether `ip` is on the allowlist. Reads the table at most once per TTL per
 * instance, and only for visitors from a blocked country — everyone else never
 * triggers a read.
 *
 * Fails closed: if the table can't be read and there is no earlier copy, nobody
 * from a blocked country gets in (signed-in staff and the sign-in screens still
 * do, via the proxy). With an earlier copy, that copy keeps being used.
 */
export async function isAllowlisted(ip: string): Promise<boolean> {
  const now = Date.now();
  if (!cached || cached.expires <= now) {
    inflight ??= fetchAllowlist()
      .then((list) => {
        cached = { list, expires: Date.now() + ALLOWLIST_TTL_MS };
        return list;
      })
      .catch((e: unknown) => {
        console.warn('[region-block]', e instanceof Error ? e.message : e);
        const list = cached?.list ?? new BlockList();
        cached = { list, expires: Date.now() + RETRY_AFTER_FAILURE_MS };
        return list;
      })
      .finally(() => {
        inflight = null;
      });
    await inflight;
  }
  return isAllowed(cached!.list, ip);
}

/** Test seam: forget the cached copy. */
export function resetAllowlistCache(): void {
  cached = null;
  inflight = null;
}
