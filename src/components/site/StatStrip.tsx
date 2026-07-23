import { motion } from 'framer-motion';

import { entrance } from '@/lib/animations';

/**
 * The experience stat row — docs/plans/04-components-spec.md. Numbers render in
 * Zilla Slab, labels in mono, per the mockup.
 *
 * NOTE (docs/plans/00-context.md open item): the 4th "#1 Verified" slot from the
 * sample is the ex-Upwork placeholder — vague/unverifiable — so it is dropped
 * here rather than shipped. Ships as 3 real stats until a verifiable 4th exists.
 * Also flagged for launch: the "14+ yrs / 23,000+" provenance vs. the
 * "from-scratch, no prior company" rule — confirm attribution before going public.
 */
const DEFAULT_STATS = [
  { value: '14+ yrs', label: 'Experience' },
  { value: '23,000+', label: 'Searches run' },
  { value: '30+', label: 'Programs' },
];

type Stat = { value: string; label: string };

export default function StatStrip({ stats = DEFAULT_STATS }: { stats?: Stat[] }) {
  return (
    <motion.dl variants={entrance} className="flex flex-wrap gap-x-10 gap-y-5">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt className="sr-only">{stat.label}</dt>
          <dd>
            <span className="block font-display text-xl font-bold text-ink">{stat.value}</span>
            <span className="mt-0.5 block font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
              {stat.label}
            </span>
          </dd>
        </div>
      ))}
    </motion.dl>
  );
}
