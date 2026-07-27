import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import GlassPanel from '@/components/system/GlassPanel';
import { getPayloadClient } from '@/lib/payload';

export const dynamic = 'force-dynamic';

/**
 * Role-aware portal landing. Management-only for now: each role sees a short
 * "what's coming" note. The real per-role dashboards (affiliate referrals,
 * searcher queue, agent queue) land in follow-up PRs and slot in here, gated by
 * the same session in the layout.
 */

const ROLE_INTRO: Record<string, { title: string; blurb: string }> = {
  admin: {
    title: 'Admin',
    blurb: 'Use the admin console to manage accounts, customers, and content.',
  },
  agent: {
    title: 'Agent',
    blurb: 'Your customer queue and assigned searches will appear here soon.',
  },
  searcher: {
    title: 'Searcher',
    blurb: 'Your assigned award searches and their status will appear here soon.',
  },
  affiliate: {
    title: 'Affiliate',
    blurb: 'Your referral link, referred clients, and payouts will appear here soon.',
  },
};

export default async function PortalPage() {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await headers() });

  // The layout already gates this, but re-check to satisfy types and be safe.
  if (!user || user.collection !== 'users') redirect('/login');

  const intro = ROLE_INTRO[user.role] ?? {
    title: user.role,
    blurb: 'Your dashboard is being set up.',
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-ink-muted">
          {intro.title} portal
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-ink">
          Welcome{user.name ? `, ${user.name}` : ''}.
        </h1>
      </div>

      <GlassPanel padding="p-6 sm:p-8">
        <p className="text-sm text-ink-sub">{intro.blurb}</p>
        {user.role === 'admin' && (
          <a
            href="/admin"
            className="sm-cta-ghost mt-5 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium"
          >
            Go to admin console
          </a>
        )}
      </GlassPanel>
    </div>
  );
}
