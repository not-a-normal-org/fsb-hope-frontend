'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Plane } from 'lucide-react';

import type { FlightReport } from '@/lib/reports';

/**
 * The hero's proof artifact — an illustrative "Search Report", the deliverable a
 * client receives. Clearly labelled an EXAMPLE (never a specific real customer's
 * result — no fabricated proof, docs/plans/00). Data-driven so the region tabs
 * (RegionalReports) can swap it. Amber `--sm-proof` marks the confirmation + the
 * point total; a plane flies the route (blue `--sm-accent`). Switch + entrance
 * animation is owned by the RegionalReports wrapper.
 */

function cabinCode(cabin: string): string {
  const c = cabin.toLowerCase();
  if (c.startsWith('first')) return 'F';
  if (c.startsWith('business')) return 'J';
  if (c.startsWith('premium')) return 'W';
  return 'Y';
}

/**
 * Dashed route line with a plane translating across it — reimplemented from the
 * archive's FlightRouteCard pattern (measure width via ResizeObserver, animate
 * the plane's x). Halts fully under reduced motion. Re-keys per report so it
 * re-flies when the region changes.
 */
function FlightPath({ replayKey }: { replayKey: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative mx-2 h-4 flex-1">
      <div
        className="absolute inset-x-0 top-1/2 border-t border-dashed"
        style={{ borderColor: 'var(--sm-glass-border)' }}
      />
      {!reduce && width > 12 && (
        <motion.span
          key={replayKey}
          aria-hidden
          className="absolute top-1/2"
          style={{ y: '-50%', color: 'var(--sm-accent)' }}
          initial={{ x: 0 }}
          animate={{ x: width - 12 }}
          transition={{ duration: 2.6, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1.1 }}
        >
          <Plane className="h-3.5 w-3.5" style={{ transform: 'rotate(45deg)' }} aria-hidden />
        </motion.span>
      )}
    </div>
  );
}

export default function SearchReportCard({ report }: { report: FlightReport }) {
  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{
        background: 'var(--sm-bg-elevated)',
        border: '1px solid var(--sm-glass-border)',
        boxShadow: 'var(--sm-glass-shadow), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-muted">
          Example report · #{report.id}
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.08em]"
          style={{
            color: 'var(--sm-proof)',
            background: 'var(--sm-proof-soft)',
            border: '1px solid color-mix(in srgb, var(--sm-proof) 40%, transparent)',
          }}
        >
          <Check className="h-3 w-3" aria-hidden strokeWidth={3} />
          Confirmed
        </span>
      </div>

      {/* Route + plane */}
      <div className="mt-5 flex items-center gap-1">
        <span className="font-display text-3xl font-bold text-ink">{report.from}</span>
        <FlightPath replayKey={report.id} />
        <span className="font-display text-3xl font-bold text-ink">{report.to}</span>
      </div>
      <p className="mt-2 text-sm text-ink-sub">
        {report.airline} · {report.cabin} · {report.date}
      </p>

      {/* Cost */}
      <div className="mt-5 space-y-1">
        <p className="font-mono text-xl font-semibold" style={{ color: 'var(--sm-proof)' }}>
          {report.points} pts <span className="text-ink-muted">+</span> {report.taxes} taxes
        </p>
        <p className="text-xs text-ink-muted">
          Retail fare <span className="line-through">{report.retailUSD}</span> · you pay points
        </p>
      </div>

      {/* Transfer + evidence */}
      <div className="mt-5 space-y-3 border-t pt-4" style={{ borderColor: 'var(--sm-glass-border)' }}>
        <p className="text-xs text-ink-sub">
          Transfer from <span className="text-ink">{report.transfer}</span>
        </p>
        {/* Faux availability screenshot */}
        <div
          className="rounded-lg px-3 py-2 font-mono text-[0.62rem] leading-relaxed text-ink-muted"
          style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
          aria-hidden
        >
          <span className="block">
            {report.airline} · {report.from}–{report.to} · {cabinCode(report.cabin)}
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: 'var(--sm-success)' }}
            />
            {report.seatNote}
          </span>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-4 flex items-center gap-1.5 text-[0.68rem] text-ink-muted">
        <Check className="h-3 w-3" style={{ color: 'var(--sm-proof)' }} aria-hidden strokeWidth={3} />
        Verified by hand
      </p>
    </div>
  );
}
