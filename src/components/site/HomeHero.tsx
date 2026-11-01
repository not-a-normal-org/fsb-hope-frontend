'use client';

import type { CSSProperties } from 'react';
import { Check } from 'lucide-react';

import Link from '@/components/system/LocaleLink';
import AmbientBackground from '@/components/system/AmbientBackground';
import ShineText from '@/components/system/ShineText';
import LeadCta from './LeadCta';
import StatStrip from './StatStrip';
import RegionalReports from './RegionalReports';
import { useI18n } from '@/i18n/LocaleProvider';
import type { Messages } from '@/i18n/messages/en';

/**
 * Home hero — docs/plans/02 (Home). Two columns: the thesis on the left, the
 * deliverable (an illustrative Search Report) on the right, so the page shows
 * proof instead of only describing it. The track-record stats sit in a full-bleed
 * strip below. Manual-first positioning — a real person searches, no AI claim
 * (docs/plans/00-context.md).
 */
export default function HomeHero({ m }: { m: Messages['home']['hero'] }) {
  const { common } = useI18n().m;
  return (
    <section className="relative overflow-hidden">
      <AmbientBackground variant="hero" />
      {/* Radial-gradient wash behind the blobs — the one glow on the page. */}
      <div className="pointer-events-none absolute inset-0 -z-20" style={{ background: 'var(--sm-bg-gradient)' }} />

      {/* The entrance is CSS (.sm-rise), not Framer Motion, so the hero — the
          page's LCP — is painted with the HTML instead of after hydration. */}
      <div className="mx-auto max-w-6xl px-6 pb-14 pt-24 md:pt-28">
        <div className="grid items-center gap-10 md:grid-cols-[53fr_47fr] md:gap-12">
          {/* Left — thesis */}
          <div className="sm-rise">
            <p className="font-mono text-eyebrow font-medium uppercase text-accent">
              {m.eyebrow}
            </p>
            <ShineText
              as="h1"
              className="mt-4 font-display font-bold"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', lineHeight: 1.04, letterSpacing: '-0.02em' }}
            >
              {m.title}
            </ShineText>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-sub">
              {m.body}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <LeadCta className="sm-cta rounded-full px-6 py-3 text-[14.5px] font-medium transition-colors">
                {common.startFlightRequest}
              </LeadCta>
              <Link
                href="/how-it-works"
                className="sm-cta-ghost rounded-full px-6 py-3 text-[14.5px] font-medium"
              >
                {m.secondary}
              </Link>
            </div>
            <p className="mt-4 flex items-center gap-2 text-[13px] text-ink-muted">
              <Check className="h-3.5 w-3.5" aria-hidden strokeWidth={2.5} />
              {m.noCard}
            </p>
          </div>

          {/* Right — the deliverable, by region */}
          <div className="sm-rise w-full" style={{ '--sm-rise-step': 1 } as CSSProperties}>
            <RegionalReports />
          </div>
        </div>
      </div>

      {/* Full-bleed stats strip — the track record, promoted to real authority.
          One of two deliberate blue bands on the page (Review v3 §1): the accent
          surface makes it read as emphasis against the white sections. */}
      <div className="border-y bg-surface-accent" style={{ borderColor: 'var(--sm-glass-border)' }}>
        <div className="mx-auto max-w-6xl px-6 py-7">
          <StatStrip />
        </div>
      </div>
    </section>
  );
}
