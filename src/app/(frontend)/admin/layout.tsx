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

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  if (!user || user.status !== 'active') {
    return <>{children}</>;
  }

  const pathname = (await headers()).get('x-pathname') ?? '';
  if (pathname && pathname !== '/admin/login' && !canAccessAdminPath(user.role, pathname)) {
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
