'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';

/**
 * Home alerts teaser (docs/plans/02): a short intro to the two alert products,
 * linking to /alerts. The automated-vs-human contrast is named here too, so the
 * phantom trade-off is never a surprise.
 */
const CARDS = [
  {
    name: 'Weekly Lookup Alert',
    price: '$4.99/mo',
    body: 'An automated weekly scan of your routes. Cheap and broad — and honest that some space it surfaces may be phantom.',
  },
  {
    name: 'Human Search Alert',
    price: '$99.99/mo',
    body: 'A real person checks your routes each cycle and sends verified results. The opposite of an automated feed.',
  },
];

export default function AlertsTeaser() {
  return (
    <section className="relative overflow-hidden border-t" style={{ borderColor: 'var(--sm-glass-border)' }}>
      <AmbientBackground variant="section" />
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <motion.div variants={entrance} {...inViewOnce} className="max-w-2xl">
          <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">Alerts</p>
          <h2 className="mt-3 font-display text-section font-bold text-ink">
            Not ready to book? Keep watching your routes.
          </h2>
        </motion.div>

        <motion.div
          variants={staggerParent}
          {...inViewOnce}
          className="mt-10 grid gap-6 md:grid-cols-2"
        >
          {CARDS.map((c) => (
            <motion.div key={c.name} variants={entrance}>
              <GlassPanel as="div" className="flex h-full flex-col">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-card font-bold text-ink">{c.name}</h3>
                  <span className="shrink-0 font-mono text-sm text-accent">{c.price}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-sub">{c.body}</p>
              </GlassPanel>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={entrance} {...inViewOnce} className="mt-8">
          <Link href="/alerts" className="text-sm text-ink-sub underline underline-offset-4 transition-colors hover:text-ink">
            Compare the alert plans →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
