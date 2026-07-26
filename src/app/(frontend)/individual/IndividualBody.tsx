'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import LeadModal from '@/components/site/LeadModal';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';

/**
 * /individual body (docs/plans/02): personal-points framing, how it works for
 * you, the $25 + $99 pricing explained plainly (full breakdown on /pricing),
 * and the Weekly Lookup Alert cross-sell as the natural next step.
 *
 * The primary CTA opens the multi-step lead modal (LeadModal → /api/leads); the
 * inline calculator is deferred to a later slice.
 */
const STEPS = [
  {
    title: 'Tell us the trip',
    body: 'Where you want to go and the points you hold. No account, no long form.',
  },
  {
    title: 'A person searches',
    body: 'We search your points by hand across 30+ programs — the routings tools miss.',
  },
  {
    title: 'You get proof',
    body: 'A screenshot and the exact point cost. You only pay the $99 fee if we find a bookable seat.',
  },
];

const ctaBase =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors';

export default function IndividualBody() {
  const [leadOpen, setLeadOpen] = useState(false);
  return (
    <>
      <section className="relative overflow-hidden">
        <AmbientBackground variant="section" />
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <motion.h2
            variants={entrance}
            {...inViewOnce}
            className="max-w-2xl font-display text-section font-bold text-ink"
          >
            How it works for you
          </motion.h2>
          <motion.div
            variants={staggerParent}
            {...inViewOnce}
            className="mt-10 grid gap-6 md:grid-cols-3"
          >
            {STEPS.map((s) => (
              <motion.div key={s.title} variants={entrance}>
                <GlassPanel as="div" className="h-full">
                  <h3 className="font-display text-card font-bold text-ink">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-sub">{s.body}</p>
                </GlassPanel>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={entrance} {...inViewOnce} className="mt-8">
            <Link href="/how-it-works" className="text-sm text-ink-sub underline underline-offset-4 transition-colors hover:text-ink">
              See the full process →
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative" style={{ borderTop: '1px solid var(--sm-glass-border)' }}>
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <motion.div variants={entrance} {...inViewOnce}>
            <GlassPanel as="div">
              <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
                What it costs
              </p>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-3xl font-medium text-ink">$25</span>
                <span className="text-sm text-ink-sub">deposit to start</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-sub">
                Then a flat <span className="text-ink">$99</span> — any cabin — charged
                only once we confirm a bookable seat. Find nothing? Your deposit comes
                back in full.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setLeadOpen(true)}
                  className={`${ctaBase} sm-cta`}
                >
                  Start your search
                </button>
                <Link
                  href="/pricing"
                  className={`${ctaBase} sm-cta-ghost`}
                >
                  See full pricing
                </Link>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </section>

      <section
        className="relative overflow-hidden"
        style={{ borderTop: '1px solid var(--sm-glass-border)' }}
      >
        <AmbientBackground variant="section" />
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <motion.h2
            variants={entrance}
            {...inViewOnce}
            className="font-display text-card font-bold text-ink"
          >
            Not ready to book a trip yet?
          </motion.h2>
          <motion.p
            variants={entrance}
            {...inViewOnce}
            className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-sub"
          >
            The Weekly Lookup Alert watches your routes and tells you when award space
            opens up — $4.99/mo, cancel anytime.
          </motion.p>
          <motion.div variants={entrance} {...inViewOnce} className="mt-7">
            <Link
              href="/alerts"
              className={`${ctaBase} sm-cta-ghost`}
            >
              See alert plans
            </Link>
          </motion.div>
        </div>
      </section>

      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} type="individual" />
    </>
  );
}
