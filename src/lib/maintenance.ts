/**
 * TEMPORARY — holds the site behind an under-construction notice until launch.
 *
 * Delete this file, `src/app/(frontend)/maintenance/`, and the maintenance branch
 * in `src/proxy.ts` at launch. See `docs/maintenance-mode.md`.
 *
 * Only a plain constant lives here: `src/proxy.ts` runs in the edge runtime and
 * imports this, so this module must never pull in `server-only`, `next/headers`,
 * or any Node built-in. The staff-session check lives in `src/lib/session-edge.ts`.
 */

/**
 * Maintenance is ON unless explicitly switched off, so a deploy that forgets
 * the env var fails closed (public sees the notice) rather than open.
 * Set `MAINTENANCE_MODE=off` in `.env.local` to drop the wall entirely.
 */
export const MAINTENANCE_ENABLED = process.env.MAINTENANCE_MODE !== 'off';
