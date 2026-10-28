import type { Metadata } from 'next';

import Logo from '@/components/site/Logo';
import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import AdminUnlockForm from './AdminUnlockForm';

/**
 * TEMPORARY — the public-facing notice shown until the site launches.
 * `src/proxy.ts` rewrites every non-admin request here with a 503.
 * Delete this route at launch. See `docs/maintenance-mode.md`.
 *
 * This is the only surface the public reaches right now, so it presents the real
 * brand: dark blue glass, the locked wordmark, manual-search copy (no AI claim —
 * that product is post-launch).
 */
export const metadata: Metadata = {
  title: 'Under construction',
  robots: 'noindex, nofollow',
};

export default function MaintenancePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <AmbientBackground variant="hero" />
      <div className="pointer-events-none absolute inset-0 -z-20" style={{ background: 'var(--sm-bg-gradient)' }} />

      <GlassPanel className="w-full max-w-md text-center" padding="p-9 sm:p-11">
        <Logo className="text-3xl" />

        <h1 className="mt-8 font-display text-section font-bold text-ink">Under construction</h1>

        <p className="mt-5 text-sm leading-relaxed text-ink-sub">
          Award travel is broken, full of seats that aren&rsquo;t really there.
          We&rsquo;re building the fix: a specialist assigned to your points,
          getting you a seat worth flying. Launching soon.
        </p>

        <p className="mt-3 text-sm text-ink-sub">
          Want to talk before we launch? Email{' '}
          <a
            href="mailto:hello@savermiles.com"
            className="text-accent underline underline-offset-4 transition-colors hover:text-ink"
          >
            hello@savermiles.com
          </a>
          .
        </p>

        <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--sm-glass-border)' }}>
          <AdminUnlockForm />
        </div>
      </GlassPanel>
    </div>
  );
}
