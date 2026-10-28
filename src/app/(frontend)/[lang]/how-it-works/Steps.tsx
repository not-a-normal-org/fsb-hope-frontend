'use client';

import { motion } from 'framer-motion';

import Link from '@/components/system/LocaleLink';
import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import LeadCta from '@/components/site/LeadCta';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';
import { useI18n } from '@/i18n/LocaleProvider';
import type { Messages } from '@/i18n/messages/en';

/**
 * The three-step process (docs/plans/02): tell us the route -> we search by hand
 * -> you get proof. This carries the manual-search differentiator, so it's
 * concrete and mechanical — a real person, real proof — not vague.
 *
 * Uses only primitives already on main (AmbientBackground, GlassPanel,
 * animations) so this page ships as an independent PR.
 */
const ctaPrimary =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors';

export default function Steps({ m }: { m: Messages['howItWorks'] }) {
  const { common } = useI18n().m;
  return (
    <section className="relative overflow-hidden">
      <AmbientBackground variant="section" />
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <motion.ol
          variants={staggerParent}
          {...inViewOnce}
          className="grid gap-6 md:grid-cols-3"
        >
          {m.steps.map((step, i) => (
            <motion.li key={step.title} variants={entrance}>
              <GlassPanel as="div" className="h-full">
                <span className="font-mono text-sm tracking-[0.2em] text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-card font-bold text-ink">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-sub">{step.body}</p>
              </GlassPanel>
            </motion.li>
          ))}
        </motion.ol>

        <motion.div variants={entrance} {...inViewOnce} className="mt-12 flex flex-wrap gap-3">
          <LeadCta className={`${ctaPrimary} sm-cta`}>{common.startFlightRequest}</LeadCta>
          <Link
            href="/business"
            className={`${ctaPrimary} sm-cta-ghost`}
          >
            {m.forBusiness}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
