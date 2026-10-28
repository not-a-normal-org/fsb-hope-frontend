'use client';

import { motion, type Variants } from 'framer-motion';
import { Check, X } from 'lucide-react';

import { entrance, inViewOnce } from '@/lib/animations';
import type { Messages } from '@/i18n/messages/en';

// Scroll reveal (Review v3 §10.5): the ghost column staggers in, then the real
// column follows — the argument lands in sequence instead of all at once.
const colStagger = (delayChildren: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren } },
});
const revealOnce = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true, amount: 0.3 },
} as const;

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

function Row({ text, tone }: { text: string; tone: 'warning' | 'success' }) {
  const color = tone === 'success' ? 'var(--sm-success)' : 'var(--sm-warning)';
  const Icon = tone === 'success' ? Check : X;
  return (
    <motion.li variants={entrance} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: 'var(--sm-ink-invert-sub)' }}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" style={{ color }} strokeWidth={2.5} aria-hidden />
      {text}
    </motion.li>
  );
}

export default function GhostVsRealCompare({ m }: { m: Messages['home']['compare'] }) {
  return (
    <section className="relative" style={{ background: 'var(--sm-surface-invert)' }}>
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <motion.div variants={entrance} {...inViewOnce} className="max-w-2xl">
          <p
            className="font-mono text-sm font-semibold uppercase tracking-[0.14em]"
            style={{ color: 'var(--sm-accent-invert)' }}
          >
            {m.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-section font-bold" style={{ color: 'var(--sm-ink-invert)' }}>
            {m.title}
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
              <p className="font-mono text-eyebrow uppercase tracking-[0.14em]" style={{ color: 'var(--sm-ink-invert-sub)' }}>
                {m.ghostHeading}
              </p>
              <motion.ul className="mt-5 space-y-3.5" variants={colStagger(0)} {...revealOnce}>
                {m.ghost.map((t) => (
                  <Row key={t} text={t} tone="warning" />
                ))}
              </motion.ul>
            </div>

            {/* By hand — center divider on desktop, stacked divider on mobile */}
            <div
              className="border-t p-6 sm:p-8 md:border-l md:border-t-0"
              style={{ borderColor: 'var(--sm-invert-border)' }}
            >
              <p className="font-mono text-eyebrow uppercase tracking-[0.14em]" style={{ color: 'var(--sm-ink-invert)' }}>
                {m.realHeading}
              </p>
              <motion.ul className="mt-5 space-y-3.5" variants={colStagger(0.45)} {...revealOnce}>
                {m.real.map((t) => (
                  <Row key={t} text={t} tone="success" />
                ))}
              </motion.ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
