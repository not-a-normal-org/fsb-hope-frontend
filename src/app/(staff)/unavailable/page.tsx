import type { Metadata } from 'next';

import Logo from '@/components/site/Logo';
import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';

/**
 * The notice a visitor from a blocked region sees — `src/proxy.ts` rewrites
 * their request here with a 403 (see src/lib/region-block.ts). It lives in the
 * staff route group, like /maintenance, because it is English-only and sits
 * outside the localized public tree.
 */
export const metadata: Metadata = {
  title: 'Not available in your region',
  robots: 'noindex, nofollow',
};

export default function UnavailablePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <AmbientBackground variant="hero" />
      <div className="pointer-events-none absolute inset-0 -z-20" style={{ background: 'var(--sm-bg-gradient)' }} />

      <GlassPanel className="w-full max-w-md text-center" padding="p-9 sm:p-11">
        <Logo className="text-3xl" />

        <h1 className="mt-8 font-display text-section font-bold text-ink">
          Not available in your region
        </h1>

        <p className="mt-5 text-sm leading-relaxed text-ink-sub">
          Saver Miles isn&rsquo;t currently offered where you are.
        </p>
      </GlassPanel>
    </div>
  );
}
