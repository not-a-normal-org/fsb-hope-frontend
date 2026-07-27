import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import GlassPanel from '@/components/system/GlassPanel';
import { getPayloadClient } from '@/lib/payload';
import AffiliateDashboard from './AffiliateDashboard';

export const dynamic = 'force-dynamic';

/**
 * Portal landing, dispatched by role. Affiliate has a real dashboard; the other
 * roles (agent/searcher/admin) show a short "what's coming" note until their own
 * dashboards land — each gated by the same session in the layout.
 */

const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  agent: 'Agent',
  searcher: 'Searcher',
  affiliate: 'Affiliate',
};

const ROLE_BLURB: Record<string, string> = {
  admin: 'Use the admin console to manage accounts, customers, and content.',
  agent: 'Your customer queue and assigned searches will appear here soon.',
  searcher: 'Your assigned award searches and their status will appear here soon.',
};

export default async function PortalPage() {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });

  // The layout already gates this; re-check to satisfy types and be safe.
  if (!user || user.collection !== 'users') redirect('/login');

  const roleLabel = ROLE_LABELS[user.role] ?? user.role;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-ink-muted">
          {roleLabel} portal
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">
          Welcome{user.name ? `, ${user.name}` : ''}.
        </h1>
      </div>

      {user.role === 'affiliate' ? (
        <AffiliateDashboard user={user} />
      ) : (
        <GlassPanel padding="p-6 sm:p-8">
          <p className="text-sm text-ink-sub">
            {ROLE_BLURB[user.role] ?? 'Your dashboard is being set up.'}
          </p>
          {user.role === 'admin' && (
            <a
              href="/admin"
              className="sm-cta-ghost mt-5 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
            >
              Go to admin console
            </a>
          )}
        </GlassPanel>
      )}
    </div>
  );
}
