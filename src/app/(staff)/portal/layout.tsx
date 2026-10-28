import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import AmbientBackground from '@/components/system/AmbientBackground';
import Logo from '@/components/site/Logo';
import { getPayloadClient } from '@/lib/payload';
import LogoutButton from './LogoutButton';

// Reads the session per request (payload.auth), so it must be dynamic.
export const dynamic = 'force-dynamic';

/**
 * Account portal shell + auth gate. The construction wall lets `/portal/*`
 * through (see proxy.ts) precisely so this layout can enforce the real gate:
 * a valid, active Payload `users` session. Anyone else is redirected to /login
 * before any child renders, so no content leaks.
 */
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });

  if (!user || user.collection !== 'users' || user.status !== 'active') {
    redirect('/login');
  }

  return (
    <div className="relative min-h-screen">
      <AmbientBackground variant="section" />

      <header className="flex items-center justify-between border-b border-[color:var(--sm-glass-border)] px-5 py-4 sm:px-8">
        <Logo className="text-xl" />
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-ink-sub sm:inline">
            {user.name || user.email}
            <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-accent">
              {user.role}
            </span>
          </span>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
