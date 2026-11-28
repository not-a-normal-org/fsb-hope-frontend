import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { navForRole, canAccessAdminPath, adminHome } from '@/lib/access';
import AdminShell from './AdminShell';

/**
 * /admin layout — the console chrome, shown only to a signed-in account whose
 * role opens the page.
 *
 * Server component: reads the Payload session (`payload.auth`, the authoritative
 * check) and the `x-pathname` header the proxy stamps on each admin request.
 *  - No active user → redirect to login. The proxy lets through any token whose
 *    claims say "active staff", including one for an account suspended since.
 *  - Active user on a path their role can't open → redirect to their home section.
 *  - Otherwise render the role-filtered console shell.
 *
 * These redirects keep the chrome right but are not the page gate: Next renders
 * the page alongside this layout and streams its data even when the layout
 * redirects. Each page checks its caller first (lib/auth.ts `requireAdminPath`).
 */
export const dynamic = 'force-dynamic';

// /admin/login and /admin/reset-password are client pages and can't export
// metadata, so the console's title and description live here.
export const metadata: Metadata = {
  title: 'Staff console',
  description:
    'The Saver Miles staff console for leads, customers, orders and the team. It is open to signed-in staff only, and each role sees its own sections.',
  robots: { index: false, follow: false },
};

const AUTH_SCREENS = new Set(['/admin/login', '/admin/reset-password']);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get('x-pathname') ?? '';

  // The login / reset screens are standalone — never wrap them in the console
  // chrome, signed in or not.
  if (AUTH_SCREENS.has(pathname)) {
    return <>{children}</>;
  }

  const user = await getCurrentUser();

  if (!user || user.status !== 'active') {
    redirect(`/admin/login?from=${encodeURIComponent(pathname || '/admin')}`);
  }

  if (pathname && !canAccessAdminPath(user.role, pathname)) {
    redirect(adminHome(user.role));
  }

  return (
    <AdminShell
      nav={navForRole(user.role)}
      user={{ name: user.name, email: user.email, role: user.role }}
    >
      {children}
    </AdminShell>
  );
}
