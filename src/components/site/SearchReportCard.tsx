'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

import { EASE_OUT } from '@/lib/animations';

/**
 * The hero's proof artifact — an illustrative "Search Report", the deliverable a
 * client receives. Clearly labelled an EXAMPLE (never presented as a specific
 * real customer's result — no fabricated social proof, per docs/plans/00). Amber
 * `--sm-proof` marks the confirmation + the point total; everything else stays in
 * the blue/steel system. Tilts slightly, floats gently, straightens on hover.
 * Motion respects the global reduced-motion config (MotionProvider).
 */
export default function SearchReportCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: -3 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 }}
      className="mx-auto w-full max-w-sm"
    >
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ rotate: 0, scale: 1.015 }}
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
            Example report · #4412
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

        {/* Route */}
        <div className="mt-5 flex items-center gap-3">
          <span className="font-display text-3xl font-bold text-ink">JFK</span>
          <span className="flex-1 border-t border-dashed" style={{ borderColor: 'var(--sm-glass-border)' }} />
          <ArrowRight className="h-4 w-4 text-ink-muted" aria-hidden />
          <span className="flex-1 border-t border-dashed" style={{ borderColor: 'var(--sm-glass-border)' }} />
          <span className="font-display text-3xl font-bold text-ink">NRT</span>
        </div>
        <p className="mt-2 text-sm text-ink-sub">ANA · Business · 24 Oct</p>

        {/* Cost */}
        <div className="mt-5 space-y-1">
          <p className="font-mono text-xl font-semibold" style={{ color: 'var(--sm-proof)' }}>
            75,000 pts <span className="text-ink-muted">+</span> $64.30 taxes
          </p>
          <p className="text-xs text-ink-muted">
            Retail fare <span className="line-through">$6,240</span> · you pay points
          </p>
        </div>

        {/* Transfer + evidence */}
        <div
          className="mt-5 space-y-3 border-t pt-4"
          style={{ borderColor: 'var(--sm-glass-border)' }}
        >
          <p className="text-xs text-ink-sub">
            Transfer from <span className="text-ink">Amex MR</span> · 1:1
          </p>
          {/* Faux availability screenshot */}
          <div
            className="rounded-lg px-3 py-2 font-mono text-[0.62rem] leading-relaxed text-ink-muted"
            style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
            aria-hidden
          >
            <span className="block">NH 9 · JFK–NRT · J</span>
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: 'var(--sm-success)' }}
              />
              1 seat · confirmed available
            </span>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-4 flex items-center gap-1.5 text-[0.68rem] text-ink-muted">
          <Check className="h-3 w-3" style={{ color: 'var(--sm-proof)' }} aria-hidden strokeWidth={3} />
          Verified by hand · found in 02:14
        </p>
      </motion.div>
    </motion.div>
  );
}
