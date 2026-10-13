/**
 * Guard for the Postgres connection string Payload uses (DATABASE_URI).
 *
 * Supabase serves two poolers on the SAME host with the same credentials:
 *  - SESSION (port 5432): one Postgres connection per client, hard-capped at
 *    pool_size 15. On Vercel every serverless instance opens its own
 *    node-postgres pool, so a handful of warm instances take all 15 slots and
 *    every later connection is refused with `EMAXCONNSESSION`. Frozen instances
 *    keep their slots, so the outage outlives the burst that caused it. It
 *    surfaces as "This page couldn't load" on /cms, saves that never land, and
 *    staff bounced to the login screen (Payload's auth swallows the DB error and
 *    reports "no user").
 *  - TRANSACTION (port 6543): multiplexes many short-lived clients — the only
 *    one that works for serverless.
 *
 * The session string is what Supabase's dashboard and our own early spike notes
 * hand out, and it has reached production twice. So a production build no longer
 * trusts the env var to be right: a Supabase *pooler* URI on the session port is
 * moved to the transaction port.
 *
 * Scope is deliberately narrow. Only production (`next build` / `next start` /
 * Vercel) is rewritten — `next dev` and `payload run` scripts keep whatever is
 * configured, session pooler included. And only the pooler host matches: a direct
 * `db.<ref>.supabase.co` string or any non-Supabase host passes through untouched.
 */

// The pooler host with the session port (explicit 5432, or none — 5432 is the
// default). Anchored on the last `@` so a password can't be mistaken for a host.
const SESSION_POOLER = /(@[^/?#@]*\.pooler\.supabase\.com)(?::5432)?(?=[/?#]|$)/i;

export const TRANSACTION_POOLER_PORT = 6543;

/** True when `uri` is a Supabase pooler string on the session port. */
export function isSessionPoolerUri(uri: string): boolean {
  return SESSION_POOLER.test(uri);
}

/**
 * The connection string to actually use. In production, a Supabase session-pooler
 * URI has its port swapped for the transaction pooler; only the port changes, so
 * the rest of the string (password included) stays byte-for-byte as configured.
 */
export function resolveDatabaseUri(
  uri: string,
  production: boolean = process.env.NODE_ENV === 'production',
): string {
  if (!production || !isSessionPoolerUri(uri)) return uri;
  // Once per instance: the real fix is the env var, so keep saying so in the logs.
  console.warn(
    `[db] DATABASE_URI points at the Supabase SESSION pooler (port 5432); using the ` +
      `transaction pooler (${TRANSACTION_POOLER_PORT}) instead. Update the env var.`,
  );
  return uri.replace(SESSION_POOLER, `$1:${TRANSACTION_POOLER_PORT}`);
}
