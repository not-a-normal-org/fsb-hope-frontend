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

// ── Where each check goes ──────────────────────────────────────────────────────
//
// The /admin layout's role check is not enough on its own, and the proxy in front
// only asks "is this any active staff token", from claims up to 8 hours old.
//  - Pages: Next renders a page alongside its layout, so a redirect in the layout
//    still streams the page's data in the response body. Every server-rendered
//    /admin page calls `requireAdminPath` before it loads anything.
//  - Server actions: each is its own POST endpoint, run before any page renders.
//    Every /admin action calls `getAuthorizedUser` or `requireAuthorizedUser`.
//  - /api/admin routes: `getAuthorizedUser`, with the page the data is for.
// All of them read the account from the database, so a suspension or a role
// change applies to the very next request.

/**
 * Require that the user may open `pathname`. Redirects unauthenticated users to
 * login, and authenticated-but-unauthorized users to their own home section.
 * Call first in each /admin/<section>/page.tsx, with its literal path.
 */
export async function requireAdminPath(pathname: string): Promise<CurrentUser> {
  const user = await requireUser(pathname);
  if (!canAccessAdminPath(user.role, pathname)) {
    redirect(adminHome(user.role));
  }
  return user;
}

/**
 * The signed-in account, if it is active and its role opens the /admin page at
 * `pathname`; otherwise null. For server actions and /api/admin routes, which
 * report a refusal instead of redirecting.
 */
export async function getAuthorizedUser(pathname: string): Promise<CurrentUser | null> {
  const user = await getCurrentUser();
  if (!user || user.status !== 'active' || !canAccessAdminPath(user.role, pathname)) return null;
  return user;
}

/** `getAuthorizedUser` for server actions that report failure by throwing. */
export async function requireAuthorizedUser(pathname: string): Promise<CurrentUser> {
  const user = await getAuthorizedUser(pathname);
  if (!user) throw new Error('Unauthorized');
  return user;
}
