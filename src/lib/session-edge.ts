/**
 * Edge-safe verification of Payload's `payload-token` JWT — used by the
 * construction wall + admin gate in `src/proxy.ts` as a FAST PRE-FILTER only.
 *
 * Payload signs the session JWT with HS256, and — because `role`/`status` are
 * `saveToJWT: true` on the users collection — both are inside the token. So we
 * can read them here without a DB call. This proves the token was validly issued
 * and not expired; it CANNOT see a server-side revocation or a role/status change
 * made after issue (≤2h window). The authoritative check stays in the Node
 * `/admin` layout via `payload.auth`.
 *
 * The signing key is NOT the raw PAYLOAD_SECRET — Payload derives it as
 * `sha256(PAYLOAD_SECRET)` hex-encoded, first 32 chars (see Payload's initSecret).
 * We reproduce that with Web Crypto so this stays edge-compatible (no Node
 * built-ins, no `server-only`).
 */
import { jwtVerify } from 'jose';

export type StaffToken = {
  id: string | number;
  email?: string;
  role?: string;
  status?: string;
};

let cachedKey: Uint8Array | null = null;

/** Payload's derived JWT key: first 32 hex chars of sha256(PAYLOAD_SECRET). */
async function getSigningKey(): Promise<Uint8Array | null> {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret) return null;
  if (cachedKey) return cachedKey;
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  cachedKey = new TextEncoder().encode(hex.slice(0, 32));
  return cachedKey;
}

/** Verify the token's signature + expiry and pull the staff claims out. */
export async function verifyStaffToken(token: string | undefined): Promise<StaffToken | null> {
  if (!token) return null;
  const key = await getSigningKey();
  if (!key) return null;

  try {
    const { payload } = await jwtVerify(token, key);
    // Only user-collection sessions count as staff (not any future API tokens).
    if (payload.collection !== 'users') return null;
    return {
      id: payload.id as string | number,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      role: typeof payload.role === 'string' ? payload.role : undefined,
      status: typeof payload.status === 'string' ? payload.status : undefined,
    };
  } catch {
    // Bad signature, expired, malformed → treat as anonymous (fail closed).
    return null;
  }
}

/** A valid, active staff session. */
export function isActiveStaff(token: StaffToken | null): boolean {
  return !!token && token.status === 'active';
}
