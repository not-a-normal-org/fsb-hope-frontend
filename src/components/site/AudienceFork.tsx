'use client';

import { motion } from 'framer-motion';

import Link from '@/components/system/LocaleLink';
import GlassPanel from '@/components/system/GlassPanel';
import { entrance, staggerParent, inViewOnce, hoverGlass } from '@/lib/animations';
import type { Messages } from '@/i18n/messages/en';

/**
 * The primary navigation decision of the whole site (docs/plans/04): two large
 * glass cards that split the brand into its two audiences. Real visual weight,
 * not a small toggle.
 */
const CARDS = [
  { key: 'individual', href: '/individual' },
  { key: 'business', href: '/business' },
] as const;

export default function AudienceFork({ m }: { m: Messages['home']['fork'] }) {
  return (
    <section className="relative" style={{ background: 'var(--sm-surface-raised)' }}>
      <motion.div
        variants={staggerParent}
        {...inViewOnce}
        className="mx-auto grid max-w-6xl gap-6 px-6 py-20 md:grid-cols-2 md:py-24"
      >
        {CARDS.map(({ key, href }) => ({ href, ...m[key] })).map((card) => (
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
