import type { Metadata } from 'next';

import NavBar from './NavBar';
import Footer from './Footer';
import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import ShineText from '@/components/system/ShineText';

/**
 * Shared skeleton for the /individual and /business tracks (first slice).
 *
 * These pages are stubbed so the AudienceFork links resolve and the sitemap is
 * navigable; the full pain-first heroes, pricing, and lead flows come in a later
 * slice (docs/plans/02, 07 Phase 5+7).
 */
export default function AudienceHeroSkeleton({
  eyebrow,
  headline,
  body,
}: {
  eyebrow: string;
  headline: string;
  body: string;
}) {
  return (
    <>
      <NavBar />
      <section className="relative overflow-hidden">
        <AmbientBackground variant="hero" />
        <div className="pointer-events-none absolute inset-0 -z-20" style={{ background: 'var(--sm-bg-gradient)' }} />
        <div className="mx-auto max-w-6xl px-6 pb-28 pt-24 md:pt-28">
          <GlassPanel maxWidth="max-w-2xl" padding="p-9 sm:p-11">
            <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">{eyebrow}</p>
            <ShineText as="h1" className="mt-4 text-hero font-bold">
              {headline}
            </ShineText>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-relaxed text-ink-sub">{body}</p>
            <p className="mt-8 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink-muted">
              Full page in progress
            </p>
          </GlassPanel>
        </div>
      </section>
      <Footer />
    </>
  );
}

export function audienceMetadata(title: string): Metadata {
  return { title };
}
