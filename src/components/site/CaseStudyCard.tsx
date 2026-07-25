import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import GlassPanel from '@/components/system/GlassPanel';
import { cabinLabel, formatPoints, type CaseStudy } from '@/lib/case-studies';

/**
 * A booked award redemption on glass — cabin badge, From → To, the points +
 * program the trip cost, an optional client quote, and a "See details" link to
 * the full write-up at /results/[slug]. Shared by the /results wall and the home
 * proof teaser; presentational only.
 */
export default function CaseStudyCard({
  study,
  featured = false,
}: {
  study: CaseStudy;
  featured?: boolean;
}) {
  return (
    <GlassPanel
      as="article"
      className="flex h-full flex-col"
      padding={featured ? 'p-8 sm:p-10' : 'p-6 sm:p-7'}
    >
      {study.cabin && (
        <span
          className="inline-flex w-fit rounded-full px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.14em]"
          style={{
            background: 'color-mix(in srgb, var(--sm-accent) 14%, transparent)',
            color: 'var(--sm-accent)',
            border: '1px solid var(--sm-glass-border)',
          }}
        >
          {cabinLabel(study.cabin)}
        </span>
      )}

      <div
        className={`mt-4 flex items-center gap-2.5 font-display font-bold text-ink ${
          featured ? 'text-2xl md:text-3xl' : 'text-xl'
        }`}
      >
        <span>{study.from}</span>
        <ArrowRight className={`text-accent ${featured ? 'h-6 w-6' : 'h-5 w-5'}`} aria-hidden />
        <span>{study.to}</span>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
        <div>
          <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted">
            Points used
          </dt>
          <dd className="mt-1 font-display text-lg font-bold text-ink">
            {formatPoints(study.pointsUsed)}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink-muted">
            Program
          </dt>
          <dd className="mt-1 text-sm leading-snug text-ink-sub">{study.program ?? '—'}</dd>
        </div>
      </dl>

      {study.quote && (
        <blockquote
          className="mt-5 border-l-2 pl-4 text-sm italic leading-relaxed text-ink-sub"
          style={{ borderColor: 'var(--sm-glass-border)' }}
        >
          “{study.quote}”
          {study.attribution && (
            <cite className="mt-1 block not-italic text-ink-muted">— {study.attribution}</cite>
          )}
        </blockquote>
      )}

      <div className="mt-auto pt-6">
        <Link
          href={`/results/${study.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-ink transition-colors hover:text-accent"
          style={{ border: '1px solid var(--sm-glass-border)' }}
        >
          See details
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </GlassPanel>
  );
}
