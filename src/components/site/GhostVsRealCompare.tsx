'use client';

import { motion } from 'framer-motion';

import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';

/**
 * Ghost-vs-real comparison (docs/plans/04): what automated tools show vs. what a
 * human search delivers. This is the core differentiator made concrete —
 * "a real person checked this," not "an algorithm found this."
 *
 * The warning tone is a status color (--sm-warning), the confirmed tone is
 * success (--sm-success) — both hold across all three modes, and green stays
 * confined to its semantic success role (never decorative).
 */
const GHOST = [
  'Cached availability that may not book',
  'Phantom seats that vanish at checkout',
  'One program at a time, on the dates you thought to try',
  'A screenshot of a search, not a seat',
];

const REAL = [
  'A person opens the booking and confirms the seat',
  'Proof: the exact seat and point cost',
  '30+ programs and transfer partners, searched together',
  'Real availability on your dates, or an honest no',
];

function Row({ text, tone }: { text: string; tone: 'warning' | 'success' }) {
  const color = tone === 'success' ? 'var(--sm-success)' : 'var(--sm-warning)';
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-ink-sub">
      <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />
      {text}
    </li>
  );
}

export default function GhostVsRealCompare() {
  return (
    <section className="relative overflow-hidden">
      <AmbientBackground variant="section" />
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <motion.div variants={entrance} {...inViewOnce} className="max-w-2xl">
          <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
            Automated vs. by hand
          </p>
          <h2 className="mt-4 font-display text-section font-bold text-ink">
            The tools show you availability. We show you a bookable seat.
          </h2>
        </motion.div>

        <motion.div
          variants={staggerParent}
          {...inViewOnce}
          className="mt-12 grid gap-6 md:grid-cols-2"
        >
          <motion.div variants={entrance}>
            <GlassPanel className="h-full">
              <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-ink-muted">
                What automated tools show
              </p>
              <ul className="mt-5 space-y-3.5">
                {GHOST.map((t) => (
                  <Row key={t} text={t} tone="warning" />
                ))}
              </ul>
            </GlassPanel>
          </motion.div>

          <motion.div variants={entrance}>
            <GlassPanel className="h-full">
              <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-ink-muted">
                What Saver Miles delivers
              </p>
              <ul className="mt-5 space-y-3.5">
                {REAL.map((t) => (
                  <Row key={t} text={t} tone="success" />
                ))}
              </ul>
            </GlassPanel>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
