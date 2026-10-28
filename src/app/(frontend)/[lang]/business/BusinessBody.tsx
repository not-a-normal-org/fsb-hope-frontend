'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

import Link from '@/components/system/LocaleLink';
import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import LeadModal from '@/components/site/LeadModal';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';
import { useI18n } from '@/i18n/LocaleProvider';
import type { Messages } from '@/i18n/messages/en';

/**
 * /business body (docs/plans/02): ROI / account-level framing, custom pricing
 * ("let's talk" — no published price, docs/plans/03 §1), and the Human Search
 * Alert cross-sell for accounts with recurring, high-stakes travel.
 *
 * The primary CTA opens the multi-step business lead modal (LeadModal →
 * /api/leads); the Cal.com callback booking is a later slice.
 */

const ctaBase =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors';

export default function BusinessBody({ m }: { m: Messages['business'] }) {
  const { common } = useI18n().m;
  const [leadOpen, setLeadOpen] = useState(false);
  const v = m.value;
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

      {/* Institutional value — the higher-value audience gets numbers and a
          reporting angle, so Business reads differently from Individual (§4/§5). */}
      <section className="relative" style={{ borderTop: '1px solid var(--sm-glass-border)', background: 'var(--sm-surface-raised)' }}>
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <motion.div variants={entrance} {...inViewOnce} className="max-w-2xl">
            <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
              {v.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-section font-bold text-ink">{v.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-sub">{v.body}</p>
          </motion.div>

          <motion.div variants={entrance} {...inViewOnce} className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead>
                <tr className="text-ink-muted" style={{ borderBottom: '1px solid var(--sm-glass-border)' }}>
                  <th className="py-2.5 pr-4 font-mono text-[0.62rem] font-medium uppercase tracking-[0.12em]">{v.columns.route}</th>
                  <th className="py-2.5 pr-4 font-mono text-[0.62rem] font-medium uppercase tracking-[0.12em]">{v.columns.team}</th>
                  <th className="py-2.5 pr-4 text-right font-mono text-[0.62rem] font-medium uppercase tracking-[0.12em]">{v.columns.cash}</th>
                  <th className="py-2.5 text-right font-mono text-[0.62rem] font-medium uppercase tracking-[0.12em]">{v.columns.points}</th>
                </tr>
              </thead>
              <tbody>
                {v.rows.map((r) => (
                  <tr key={r.route} style={{ borderBottom: '1px solid var(--sm-glass-border)' }}>
                    <td className="py-3 pr-4 text-ink">{r.route}</td>
                    <td className="py-3 pr-4 text-ink-sub">{r.team}</td>
                    <td className="py-3 pr-4 text-right text-ink-muted line-through">{r.cash}</td>
                    <td className="py-3 text-right font-mono font-semibold text-ink">{r.points}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 pr-4 font-medium text-ink" colSpan={2}>{v.total}</td>
                  <td className="py-3 pr-4 text-right text-ink-muted line-through">{v.totalCash}</td>
                  <td className="py-3 text-right font-mono font-semibold text-ink">{v.totalPoints}</td>
                </tr>
              </tbody>
            </table>
          </motion.div>

          <motion.p variants={entrance} {...inViewOnce} className="mt-6 text-sm leading-relaxed text-ink-sub">
            {v.footer}
          </motion.p>
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
              <p className="mt-3 text-sm leading-relaxed text-ink-sub">{m.cost.body}</p>
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

      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} type="business" />
    </>
  );
}
