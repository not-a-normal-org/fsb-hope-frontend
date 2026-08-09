'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import { DEALS, dealHref, formatPoints, type Deal } from '@/lib/deals';
import { entrance, inViewOnce, staggerParent } from '@/lib/animations';

/**
 * Deals grid (Review v3 §9) — the first section that gives a visitor something to
 * *want*, and the mid-page slot the old newsletter vacated. Typographic tiles, not
 * stock photography: the site's aesthetic is data-forward (route codes, point
 * counts, receipts), and a clean type grid beats an incoherent photo grid — it's
 * also the reviewer's explicit fallback and it costs nothing to maintain.
 *
 * Framing is TYPICAL cost, not dated availability (see src/lib/deals.ts): a price
 * benchmark, so this never becomes the phantom-availability failure mode the rest
 * of the page argues against. Each tile hands its route to the audit CTA.
 */

const CABIN_LABEL: Record<Deal['cabin'], string> = {
  Economy: 'Economy',
  Premium: 'Premium',
  Business: 'Business',
  First: 'First',
};

function Tile({ deal }: { deal: Deal }) {
  const featured = !!deal.featured;
  return (
    <motion.div
      variants={entrance}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className={featured ? 'sm:col-span-2 lg:col-span-2' : ''}
    >
      <Link
        href={dealHref(deal)}
        aria-label={`${deal.city}: ${deal.from} to ${deal.to}, ${CABIN_LABEL[deal.cabin]}, from ${formatPoints(deal.points)} points — start an audit`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl p-5"
        style={{
          background:
            'linear-gradient(150deg, var(--sm-bg-elevated) 0%, var(--sm-bg-base) 76%, color-mix(in srgb, var(--sm-proof) 10%, var(--sm-bg-base)) 100%)',
          border: '1px solid var(--sm-glass-border)',
          boxShadow: 'var(--sm-glass-shadow), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Route + cabin badge */}
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-muted">
            {deal.from}
            <ArrowRight className="h-3 w-3" aria-hidden />
            {deal.to}
          </span>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-ink-sub"
            style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
          >
            {CABIN_LABEL[deal.cabin]}
          </span>
        </div>

        {/* City anchor + numbers */}
        <div className={featured ? 'mt-4 flex flex-1 flex-wrap items-end justify-between gap-x-8 gap-y-4' : 'mt-4 flex flex-1 flex-col'}>
          <div>
            <h3 className={`font-display font-bold leading-none text-ink ${featured ? 'text-4xl' : 'text-2xl'}`}>
              {deal.city}
            </h3>
            <p className="mt-2 text-xs text-ink-muted">
              retail <span className="text-ink-sub line-through">{deal.retail}</span> · typical{' '}
              {CABIN_LABEL[deal.cabin].toLowerCase()} rate
            </p>
          </div>

          <div className={featured ? 'text-right' : 'mt-4'}>
            <p className="font-mono font-semibold text-ink">
              <span className="text-xs font-normal text-ink-muted">from </span>
              <span className={featured ? 'text-3xl' : 'text-2xl'}>{formatPoints(deal.points)}</span>
              <span className="text-sm"> pts</span>
            </p>
            {/* Transfer partner — clean at rest, revealed on hover / keyboard focus. */}
            <p
              className="mt-1 h-4 font-mono text-[0.62rem] tracking-[0.02em] text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
              aria-hidden
            >
              {deal.transfer}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function DealsGrid() {
  return (
    <section className="relative border-t" style={{ borderColor: 'var(--sm-glass-border)' }}>
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <motion.div variants={entrance} {...inViewOnce} className="max-w-2xl">
          <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
            Where your points go
          </p>
          <h2 className="mt-3 font-display text-section font-bold text-ink">
            What your points are actually worth.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-sub">
            Typical business- and first-class award prices a specialist finds on these routes —
            with the cash fare you’d otherwise pay. Your dates and balance decide the real number;
            an audit is where we find it.
          </p>
        </motion.div>

        <motion.div
          variants={staggerParent}
          {...inViewOnce}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {DEALS.map((deal) => (
            <Tile key={`${deal.from}-${deal.to}`} deal={deal} />
          ))}
        </motion.div>

        <p className="mt-6 text-xs text-ink-muted">
          Illustrative typical award prices, not a live availability feed. A real person confirms
          the seat before you book.
        </p>
      </div>
    </section>
  );
}
