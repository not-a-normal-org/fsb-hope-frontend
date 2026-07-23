/**
 * TEMPORARY — holds the site behind an under-construction notice until launch.
 *
 * Delete this file, `src/app/maintenance/`, and the maintenance branch in
 * `src/proxy.ts` at launch. See `docs/maintenance-mode.md`.
 *
 * Only plain constants live here: `src/proxy.ts` runs in the edge runtime and
 * imports these too, so this module must never pull in `server-only`,
 * `next/headers`, or any Node built-in.
 */

/** Name of the httpOnly cookie set by `/api/admin/login`. */
export const ADMIN_COOKIE = 'admin_token';

/**
 * Maintenance is ON unless explicitly switched off, so a deploy that forgets
 * the env var fails closed (public sees the notice) rather than open.
 * Set `MAINTENANCE_MODE=off` in `.env.local` while building the new frontend.
 */
export const MAINTENANCE_ENABLED = process.env.MAINTENANCE_MODE !== 'off';

/**
 * Whether `token` proves admin access.
 *
 * The `ADMIN_SECRET` presence check is load-bearing: a bare
 * `token === process.env.ADMIN_SECRET` comparison passes when BOTH sides are
 * `undefined`, so an environment missing the secret would treat every
 * anonymous visitor as an admin.
 */
export function isAdminToken(token: string | undefined): boolean {
  const secret = process.env.ADMIN_SECRET;
  return Boolean(secret) && token === secret;
}
