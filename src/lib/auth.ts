import 'server-only';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getPayloadClient } from './payload';
import { canAccessAdminPath, adminHome, isRole, type Role } from './access';

/**
 * Server-side session helpers for the /admin console. The authoritative gate —
 * `payload.auth` hits the DB, so it reflects revocation and role/status changes
 * immediately (unlike the edge pre-filter in `src/proxy.ts`).
 */

export type CurrentUser = {
  id: string | number;
  email: string;
  name: string;
  role: Role;
  status: string;
  referralCode?: string | null;
};

/** The logged-in Payload user, or null. Never throws/redirects. */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });
  if (!user || user.collection !== 'users' || !isRole(user.role)) return null;
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? '',
    role: user.role,
    status: user.status ?? 'active',
    referralCode: user.referralCode ?? null,
  };
}

/** Require any active staff user; redirect to the login otherwise. */
export async function requireUser(fromPath?: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user || user.status !== 'active') {
    redirect(`/admin/login${fromPath ? `?from=${encodeURIComponent(fromPath)}` : ''}`);
  }
  return user;
}

/**
 * Require that the user may open `pathname`. Redirects unauthenticated users to
 * login, and authenticated-but-unauthorized users to their own home section.
 * Call at the top of each /admin/<section>/page.tsx with its literal path.
 */
export async function requireAdminPath(pathname: string): Promise<CurrentUser> {
  const user = await requireUser(pathname);
  if (!canAccessAdminPath(user.role, pathname)) {
    redirect(adminHome(user.role));
  }
  return user;
}
