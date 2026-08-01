'use client';

import { type MouseEvent, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { Check, Plane } from 'lucide-react';

import type { FlightReport } from '@/lib/reports';

/**
 * The hero's proof artifact — an illustrative "Search Report", styled like a
 * premium credit/metal card (gradient face, EMV chip, diagonal gloss, beveled
 * lip, subtle mouse-parallax tilt) after the archive's FloatingCards reference.
 * Clearly labelled an EXAMPLE (no fabricated proof, docs/plans/00). Data-driven
 * for the region tabs. The gold cues use `--sm-proof`, so they stay hueless in
 * Mono; the tilt halts under reduced motion. Switch/entrance is owned by the
 * RegionalReports wrapper.
 */

function cabinCode(cabin: string): string {
  const c = cabin.toLowerCase();
  if (c.startsWith('first')) return 'F';
  if (c.startsWith('business')) return 'J';
  if (c.startsWith('premium')) return 'W';
  return 'Y';
}

/** Gold EMV chip (hueless in Mono — proof resolves to a neutral there). */
function Chip() {
  return (
    <div
      className="relative h-6 w-9 rounded-md"
      style={{
        background:
          'linear-gradient(135deg, color-mix(in srgb, var(--sm-proof) 80%, #ffffff) 0%, var(--sm-proof) 100%)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(0,0,0,0.10)',
      }}
      aria-hidden
    >
      <span className="absolute left-1/2 top-1/2 h-2.5 w-px -translate-x-1/2 -translate-y-1/2" style={{ background: 'rgba(0,0,0,0.20)' }} />
      <span className="absolute left-1/2 top-1/2 h-px w-4 -translate-x-1/2 -translate-y-1/2" style={{ background: 'rgba(0,0,0,0.20)' }} />
    </div>
  );
}

/**
 * Dashed route line with a plane translating across it (archive FlightRouteCard
 * pattern). Halts under reduced motion; re-keys per report so it re-flies on
 * region change.
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
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed" style={{ borderColor: 'var(--sm-glass-border)' }} />
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
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-0.5, 0.5], [5.5, -5.5]);
  const rotateY = useTransform(mx, [-0.5, 0.5], [-5.5, 5.5]);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <div
      style={{ perspective: 1100 }}
      onMouseMove={reduce ? undefined : handleMove}
      onMouseLeave={reduce ? undefined : handleLeave}
    >
      <motion.div
        className="relative overflow-hidden rounded-2xl p-5 sm:p-6"
        style={{
          rotateX: reduce ? 0 : rotateX,
          rotateY: reduce ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          background:
            'linear-gradient(135deg, var(--sm-bg-elevated) 0%, var(--sm-bg-base) 58%, color-mix(in srgb, var(--sm-proof) 14%, var(--sm-bg-base)) 100%)',
          border: '1px solid var(--sm-glass-border)',
          boxShadow: 'var(--sm-glass-shadow), inset 0 1px 0 rgba(255,255,255,0.10)',
        }}
      >
        {/* Diagonal gloss, behind the content */}
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 52%)' }}
        />

        <div className="relative">
          {/* Header: chip + label left, confirmed right */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <Chip />
              <span className="mt-3 block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-muted">
                Example report · #{report.id}
              </span>
            </div>
            <span
              className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.08em]"
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
            <p className="font-mono text-xl font-semibold text-ink">
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
            <div
              className="rounded-lg px-3 py-2 font-mono text-[0.62rem] leading-relaxed text-ink-muted"
              style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
              aria-hidden
            >
              <span className="block">
                {report.airline} · {report.from}–{report.to} · {cabinCode(report.cabin)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: 'var(--sm-success)' }} />
                {report.seatNote}
              </span>
            </div>
          </div>

          {/* Footer — the single most important line in the card. */}
          <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-ink-sub">
            <Check className="h-3.5 w-3.5" style={{ color: 'var(--sm-proof)' }} aria-hidden strokeWidth={3} />
            Verified by hand
          </p>
        </div>
      </motion.div>
    </div>
  );
}
