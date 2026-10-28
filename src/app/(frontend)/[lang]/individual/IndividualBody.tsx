'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Link from '@/components/system/LocaleLink';
import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import LeadModal from '@/components/site/LeadModal';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';
import { useI18n } from '@/i18n/LocaleProvider';
import { rich } from '@/i18n/rich';
import type { Messages } from '@/i18n/messages/en';

/**
 * /individual body (docs/plans/02): personal-points framing, how it works for
 * you, the $25 + $99 pricing explained plainly (full breakdown on /pricing),
 * and the Weekly Lookup Alert cross-sell as the natural next step.
 *
 * The primary CTA opens the multi-step lead modal (LeadModal → /api/leads); the
 * inline calculator is deferred to a later slice.
 */

const ctaBase =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors';

export default function IndividualBody({ m }: { m: Messages['individual'] }) {
  const { common } = useI18n().m;
  const [leadOpen, setLeadOpen] = useState(false);
  const [initialRoute, setInitialRoute] = useState<string | undefined>();

  // Arriving from a deals tile (/individual?from=JFK&to=NRT) opens the form with
  // the route pre-filled — the grid's whole point is to pre-populate a search
  // (Review v3 §10). Read from the URL directly to avoid a Suspense boundary.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const from = p.get('from');
    const to = p.get('to');
    if (!from || !to) return;
    // Defer a tick so the state updates land in a callback, not synchronously in
    // the effect body.
    const id = window.setTimeout(() => {
      setInitialRoute(`${from.toUpperCase()} → ${to.toUpperCase()}`);
      setLeadOpen(true);
    }, 0);
    return () => clearTimeout(id);
  }, []);

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
            {m.howTitle}
          </motion.h2>
          <motion.div
            variants={staggerParent}
            {...inViewOnce}
            className="mt-10 grid gap-6 md:grid-cols-3"
          >
            {m.steps.map((s) => (
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
              {common.seeFullProcess}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative" style={{ borderTop: '1px solid var(--sm-glass-border)' }}>
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <motion.div variants={entrance} {...inViewOnce}>
            <GlassPanel as="div">
              <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
                {m.cost.eyebrow}
              </p>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-mono text-3xl font-medium text-ink">{m.cost.price}</span>
                <span className="text-sm text-ink-sub">{m.cost.unit}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-sub">
                {rich(m.cost.body, { strong: (c) => <span className="text-ink">{c}</span> })}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setLeadOpen(true)}
                  className={`${ctaBase} sm-cta`}
                >
                  {m.cost.cta}
                </button>
                <Link
                  href="/pricing"
                  className={`${ctaBase} sm-cta-ghost`}
                >
                  {common.seeFullPricing}
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
            {m.alerts.title}
          </motion.h2>
          <motion.p
            variants={entrance}
            {...inViewOnce}
            className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-sub"
          >
            {m.alerts.body}
          </motion.p>
          <motion.div variants={entrance} {...inViewOnce} className="mt-7">
            <Link
              href="/alerts"
              className={`${ctaBase} sm-cta-ghost`}
            >
              {common.seeAlertPlans}
            </Link>
          </motion.div>
        </div>
      </section>

      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} type="individual" initialRoute={initialRoute} />
    </>
  );
}
