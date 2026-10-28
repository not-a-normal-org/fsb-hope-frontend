'use client';

import { motion } from 'framer-motion';

import Link from '@/components/system/LocaleLink';
import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import StatStrip from '@/components/site/StatStrip';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';
import { useI18n } from '@/i18n/LocaleProvider';
import type { Messages } from '@/i18n/messages/en';

/**
 * /about body (docs/plans/02): mission, the manual-search differentiator, and
 * experience stats — no founder names, no prior company, no fabricated proof
 * (docs/plans/00). Transparent about the flat-fee model as the trust asset for
 * a brand with no public track record yet.
 *
 * Client component so StatStrip (framer-motion) and the section entrances work;
 * the page shell + hero stay server-rendered.
 */
const ctaBase =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors';

export default function AboutBody({ m }: { m: Messages['about'] }) {
  const { common } = useI18n().m;
  return (
    <>
      <section className="relative">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <motion.p
            variants={entrance}
            {...inViewOnce}
            className="font-display text-section font-bold leading-snug text-ink"
          >
            {m.lead}
          </motion.p>
          <motion.p
            variants={entrance}
            {...inViewOnce}
            className="mt-5 text-base leading-relaxed text-ink-sub"
          >
            {m.story}
          </motion.p>
        </div>
      </section>

      <section
        className="relative overflow-hidden"
        style={{ borderTop: '1px solid var(--sm-glass-border)' }}
      >
        <AmbientBackground variant="section" />
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <motion.h2
            variants={entrance}
            {...inViewOnce}
            className="max-w-2xl font-display text-section font-bold text-ink"
          >
            {m.howTitle}
          </motion.h2>
          <motion.div
            variants={staggerParent}
            {...inViewOnce}
            className="mt-10 grid gap-6 md:grid-cols-3"
          >
            {m.how.map((h) => (
              <motion.div key={h.title} variants={entrance}>
                <GlassPanel as="div" className="h-full">
                  <h3 className="font-display text-card font-bold text-ink">{h.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-sub">{h.body}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative" style={{ borderTop: '1px solid var(--sm-glass-border)' }}>
        <div className="mx-auto max-w-6xl px-6 py-16">
          <motion.p
            variants={entrance}
            {...inViewOnce}
            className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent"
          >
            {m.numbers}
          </motion.p>
          <div className="mt-6">
            <StatStrip />
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden"
        style={{ borderTop: '1px solid var(--sm-glass-border)' }}
      >
        <AmbientBackground variant="section" />
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <motion.div variants={entrance} {...inViewOnce}>
            <h2 className="font-display text-section font-bold text-ink">{m.chargeTitle}</h2>
            <p className="mt-5 text-base leading-relaxed text-ink-sub">{m.charge}</p>
            <Link
              href="/pricing"
              className={`mt-7 ${ctaBase} sm-cta-ghost`}
            >
              {common.seeFullPricing}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative" style={{ borderTop: '1px solid var(--sm-glass-border)' }}>
        <div className="mx-auto max-w-3xl px-6 py-16 text-center md:py-20">
          <motion.h2
            variants={entrance}
            {...inViewOnce}
            className="font-display text-section font-bold text-ink"
          >
            {m.closing}
          </motion.h2>
          <motion.div
            variants={entrance}
            {...inViewOnce}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/individual"
              className={`${ctaBase} sm-cta`}
            >
              {m.checkRoute}
            </Link>
            <Link
              href="/how-it-works"
              className={`${ctaBase} sm-cta-ghost`}
            >
              {m.seeHow}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
