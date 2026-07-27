/**
 * Referral attribution helpers. An affiliate shares
 * `${SITE_URL}/?ref=<referralCode>`; a small client (ReferralCapture) stores the
 * code in the `sm_ref` cookie, and the lead/newsletter API routes read that
 * cookie server-side and persist it as `referral_code`. The affiliate portal
 * then lists the records tagged with their code.
 *
 * Pure module (no next/server imports) so it is safe on both client and server.
 */

export const REF_COOKIE = 'sm_ref';
export const REF_MAX_AGE_DAYS = 90;

/**
 * Normalise a raw ref value. Referral codes are admin-set and case-sensitive, so
 * case is preserved; only the character set + length are constrained. Returns
 * null for anything empty or unexpected, so junk never reaches the database.
 */
export function sanitizeRefCode(raw: string | null | undefined): string | null {
  if (typeof raw !== 'string') return null;
  const value = raw.trim();
  if (!value) return null;
  return /^[A-Za-z0-9_-]{1,64}$/.test(value) ? value : null;
}
