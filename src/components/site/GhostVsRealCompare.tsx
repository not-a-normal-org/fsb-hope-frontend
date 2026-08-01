'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

import { entrance, inViewOnce } from '@/lib/animations';

/**
 * Ghost-vs-real comparison (docs/plans/04): what automated tools show vs. what a
 * human search delivers — the core differentiator made concrete. This is the ONE
 * deliberately inverted section: it sits on a light (`--sm-surface-invert`)
 * surface that flips per theme, so the page's central argument reads as a single
 * artifact that looks different from everything around it.
 *
 * Warning tone = --sm-warning, confirmed tone = --sm-success (both hold across
 * modes; green stays confined to its semantic success role).
 */
const GHOST = [
  'Cached availability that may not book',
  'Phantom seats that vanish at checkout',
  'One program at a time, on the dates you thought to try',
  'A screenshot of a search, not a seat',
];

const REAL = [
  'A specialist opens the booking and confirms your seat is really there',
  'Proof in hand: the exact seat and the point cost',
  '30+ programs and transfer partners, worked through for you',
  'Real availability on your dates, or an honest no',
];

function Row({ text, tone }: { text: string; tone: 'warning' | 'success' }) {
  const color = tone === 'success' ? 'var(--sm-success)' : 'var(--sm-warning)';
  const Icon = tone === 'success' ? Check : X;
  return (
    <li
      className="flex items-start gap-3 text-base font-medium leading-relaxed sm:text-[1.05rem]"
      style={{ color: 'var(--sm-ink-invert)' }}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color }} strokeWidth={2.75} aria-hidden />
      {text}
    </li>
  );
}

export default function GhostVsRealCompare() {
  return (
    <section className="relative" style={{ background: 'var(--sm-surface-invert)' }}>
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <motion.div variants={entrance} {...inViewOnce} className="max-w-2xl">
          <p
            className="font-mono text-sm font-semibold uppercase tracking-[0.14em]"
            style={{ color: 'var(--sm-ink-invert-sub)' }}
          >
            Automated vs. by hand
          </p>
          <h2 className="mt-4 font-display text-section font-bold" style={{ color: 'var(--sm-ink-invert)' }}>
            The tools show you availability. Your specialist hands you a seat you can book.
          </h2>
        </motion.div>

        {/* One artifact: two columns, a hard center divider. */}
        <motion.div
          variants={entrance}
          {...inViewOnce}
          className="mt-12 overflow-hidden rounded-2xl"
          style={{ border: '1px solid var(--sm-invert-border)' }}
        >
          <div className="grid md:grid-cols-2">
            {/* Automated */}
            <div className="p-6 sm:p-8">
              <p className="font-mono text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--sm-ink-invert-sub)' }}>
                What automated tools show
              </p>
              <ul className="mt-5 space-y-3.5">
                {GHOST.map((t) => (
                  <Row key={t} text={t} tone="warning" />
                ))}
              </ul>
            </div>

            {/* By hand — center divider on desktop, stacked divider on mobile */}
            <div
              className="border-t p-6 sm:p-8 md:border-l md:border-t-0"
              style={{ borderColor: 'var(--sm-invert-border)' }}
            >
              <p className="font-mono text-sm font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--sm-ink-invert)' }}>
                What a specialist delivers
              </p>
              <ul className="mt-5 space-y-3.5">
                {REAL.map((t) => (
                  <Row key={t} text={t} tone="success" />
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
