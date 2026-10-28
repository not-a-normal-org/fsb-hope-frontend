'use client';

import { motion } from 'framer-motion';

import PointsCalculator from './PointsCalculator';
import { entrance, inViewOnce } from '@/lib/animations';
import type { Messages } from '@/i18n/messages/en';

/**
 * Home calculator teaser (docs/plans/02): the compact calculator with a link to
 * the full /calculator page. Estimate-only; the component carries its own
 * "estimate only" microcopy.
 */
export default function CalculatorTeaser({
  m,
  widget,
}: {
  m: Messages['home']['calculator'];
  widget: Messages['calculator']['widget'];
}) {
  return (
    <section
      className="relative border-t"
      style={{ background: 'var(--sm-surface-raised)', borderColor: 'var(--sm-glass-border)' }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-24">
        <motion.div variants={entrance} {...inViewOnce}>
          <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">{m.eyebrow}</p>
          <h2 className="mt-3 font-display text-section font-bold text-ink">
            {m.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-sub">
            {m.body}
          </p>
        </motion.div>

        <motion.div variants={entrance} {...inViewOnce} className="md:justify-self-end">
          <PointsCalculator variant="compact" m={widget} />
        </motion.div>
      </div>
    </section>
  );
}
