'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';

/**
 * The three-step process (docs/plans/02): tell us the route -> we search by hand
 * -> you get proof. This carries the manual-search differentiator, so it's
 * concrete and mechanical — a real person, real proof — not vague.
 *
 * Uses only primitives already on main (AmbientBackground, GlassPanel,
 * animations) so this page ships as an independent PR.
 */
const STEPS = [
  {
    n: '01',
    title: 'Tell us the route',
    body: 'Send us where you want to go and the points you hold. No account, no drawn-out form — just the trip you have in mind.',
  },
  {
    n: '02',
    title: 'We search 30+ programs by hand',
    body: 'A real person searches live award space across 30+ loyalty programs and transfer partners — the routings an automated tool misses, and the seats it wrongly shows as bookable.',
  },
  {
    n: '03',
    title: 'You get proof',
    body: 'We send back what’s actually bookable: a screenshot and the exact point cost. Real availability on your dates, or an honest “not yet.”',
  },
];

const ctaPrimary =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors';

export default function Steps() {
  return (
    <section className="relative overflow-hidden">
      <AmbientBackground variant="section" />
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <motion.ol
          variants={staggerParent}
          {...inViewOnce}
          className="grid gap-6 md:grid-cols-3"
        >
          {STEPS.map((step) => (
            <motion.li key={step.n} variants={entrance}>
              <GlassPanel as="div" className="h-full">
                <span className="font-mono text-sm tracking-[0.2em] text-accent">{step.n}</span>
                <h3 className="mt-4 font-display text-card font-bold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-sub">{step.body}</p>
              </GlassPanel>
            </motion.li>
          ))}
        </motion.ol>

        <motion.div variants={entrance} {...inViewOnce} className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/individual"
            className={ctaPrimary}
            style={{ background: 'var(--sm-cta)', color: 'var(--sm-cta-text)' }}
          >
            Start an individual search
          </Link>
          <Link
            href="/business"
            className={`${ctaPrimary} border text-ink`}
            style={{ borderColor: 'var(--sm-glass-border)' }}
          >
            For business
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
