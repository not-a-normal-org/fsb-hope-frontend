'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import { entrance, staggerParent, inViewOnce, hoverGlass } from '@/lib/animations';

/**
 * The primary navigation decision of the whole site (docs/plans/04): two large
 * glass cards that split the brand into its two audiences. Real visual weight,
 * not a small toggle.
 */
const CARDS = [
  {
    href: '/individual',
    kicker: "I'm booking for myself",
    title: 'Turn the points you earned into a seat worth flying.',
    body: 'You have points and no clear way to use them well. We find the bookable award seat and show you exactly how to claim it.',
    cta: 'For individuals',
  },
  {
    href: '/business',
    kicker: "I'm managing company travel",
    title: 'Convert business travel spend into premium seats, reliably.',
    body: 'Account-level search for teams that fly often. We handle the programs and the proof so your travel budget goes further.',
    cta: 'For business',
  },
];

export default function AudienceFork() {
  return (
    <section className="relative overflow-hidden">
      <AmbientBackground variant="section" />
      <motion.div
        variants={staggerParent}
        {...inViewOnce}
        className="mx-auto grid max-w-6xl gap-6 px-6 py-20 md:grid-cols-2 md:py-24"
      >
        {CARDS.map((card) => (
          <motion.div key={card.href} variants={entrance} {...hoverGlass}>
            <Link href={card.href} className="block h-full">
              <GlassPanel as="article" className="h-full" padding="p-8 sm:p-10">
                <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
                  {card.kicker}
                </p>
                <h3 className="mt-4 font-display text-card font-bold text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-sub">{card.body}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink">
                  {card.cta}
                  <span aria-hidden="true">→</span>
                </span>
              </GlassPanel>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
