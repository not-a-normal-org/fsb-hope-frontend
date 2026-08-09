import type { ReactNode } from 'react';

import AmbientBackground from '@/components/system/AmbientBackground';
import ShineText from '@/components/system/ShineText';

/**
 * Interior-page hero — eyebrow + shine headline + intro over the glass
 * ambient/gradient backdrop. Server component (no motion), reused across
 * /pricing, /alerts, and other interior pages so they share one header shape.
 *
 * Pass `aside` to get a two-column hero with a visual on the right (Review v3 §4:
 * every interior hero was text-left with an empty right). Without it, the hero
 * stays single-column as before.
 */
export default function PageHero({
  eyebrow,
  title,
  intro,
  children,
  aside,
  compact = false,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
  /** Optional right-column visual (a report/receipt/alert artifact). */
  aside?: ReactNode;
  /** Tighter vertical rhythm + smaller headline — for list/index pages (e.g.
   *  /blog) where the grid below is the focus and the hero shouldn't dominate. */
  compact?: boolean;
}) {
  const copy = (
    <div>
      <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">{eyebrow}</p>
      <ShineText
        as="h1"
        className={`font-bold ${aside ? '' : 'max-w-3xl'} ${
          compact ? 'mt-3 text-3xl md:text-4xl' : 'mt-4 text-hero'
        }`}
      >
        {title}
      </ShineText>
      {intro && (
        <p
          className={`max-w-2xl text-[15px] leading-relaxed text-ink-sub ${
            compact ? 'mt-3' : 'mt-5'
          }`}
        >
          {intro}
        </p>
      )}
      {children}
    </div>
  );

  return (
    <section className="relative overflow-hidden">
      <AmbientBackground variant={compact ? 'section' : 'hero'} />
      <div
        className="pointer-events-none absolute inset-0 -z-20"
        style={{ background: 'var(--sm-bg-gradient)' }}
      />
      <div
        className={`mx-auto max-w-6xl px-6 ${
          compact ? 'pb-8 pt-12 md:pt-14' : 'pb-12 pt-20 md:pt-24'
        }`}
      >
        {aside ? (
          <div className="grid items-center gap-10 md:grid-cols-[1fr_minmax(0,25rem)] md:gap-12">
            {copy}
            <div className="w-full">{aside}</div>
          </div>
        ) : (
          copy
        )}
      </div>
    </section>
  );
}
