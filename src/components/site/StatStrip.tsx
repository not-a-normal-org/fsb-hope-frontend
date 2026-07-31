'use client';

import { motion } from 'framer-motion';

import { entrance } from '@/lib/animations';

/**
 * The experience stat strip — docs/plans/04-components-spec.md. Promoted to a
 * full-bleed bordered band under the hero: numbers large in the mono face, labels
 * in letterspaced caps, so the track record reads with real authority.
 *
 * NOTE (docs/plans/00-context.md open item): the 4th "#1 Verified" slot from the
 * sample is the ex-Upwork placeholder — vague/unverifiable — so it is dropped
 * here. Ships as 3 real stats until a verifiable 4th exists. Also flagged for
 * launch: the "14+ yrs / 23,000+" provenance vs. the "from-scratch, no prior
 * company" rule — confirm attribution before going public.
 */
const DEFAULT_STATS = [
  { value: '14+', label: 'Years of experience' },
  { value: '23,000+', label: 'Searches run by hand' },
  { value: '30+', label: 'Loyalty programs' },
];

type Stat = { value: string; label: string };

export default function StatStrip({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  return (
    <motion.dl
      variants={entrance}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      className="flex flex-wrap items-end gap-x-12 gap-y-6 sm:gap-x-16"
    >
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <span className="block font-mono text-[2rem] font-semibold leading-none tabular-nums text-ink sm:text-[2.5rem]">
              {stat.value}
            </span>
            <span className="mt-2 block font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-muted">
              {stat.label}
            </span>
          </dd>
        </div>
      ))}
    </motion.dl>
  );
}
