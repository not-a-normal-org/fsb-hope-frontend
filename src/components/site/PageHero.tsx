import type { ReactNode } from 'react';

import AmbientBackground from '@/components/system/AmbientBackground';
import ShineText from '@/components/system/ShineText';

/**
 * Interior-page hero — eyebrow + shine headline + intro over the glass
 * ambient/gradient backdrop. Server component (no motion), reused across
 * /pricing, /alerts, and other interior pages so they share one header shape.
 */
export default function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <AmbientBackground variant="hero" />
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{ background: 'var(--sm-bg-gradient)' }}
      />
      <div className="mx-auto max-w-6xl px-6 pb-12 pt-20 md:pt-24">
        <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">{eyebrow}</p>
        <ShineText as="h1" className="mt-4 max-w-3xl text-hero font-bold">
          {title}
        </ShineText>
        {intro && (
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ink-sub">{intro}</p>
        )}
        {children}
      </div>
    </section>
  );
}
