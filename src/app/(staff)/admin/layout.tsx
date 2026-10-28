import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';
import { navForRole, canAccessAdminPath, adminHome } from '@/lib/access';
import AdminShell from './AdminShell';

/**
 * /admin layout — the console chrome AND the single per-role page gate.
 *
 * Server component: reads the Payload session (`payload.auth`, the authoritative
 * check) and the `x-pathname` header the proxy stamps on each admin request.
 *  - No active user → render children bare (only `/admin/login` reaches here for
 *    anonymous visitors; proxy.ts redirects every other /admin route to login).
 *  - Active user on a path their role can't open → redirect to their home section.
 *  - Otherwise render the role-filtered console shell.
 */
export const dynamic = 'force-dynamic';

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
    return <>{children}</>;
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
