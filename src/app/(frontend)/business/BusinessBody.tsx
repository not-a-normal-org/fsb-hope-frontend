'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import LeadModal from '@/components/site/LeadModal';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';

/**
 * /business body (docs/plans/02): ROI / account-level framing, the $25-per-search
 * model explained plainly (full breakdown on /pricing), and the Human Search
 * Alert cross-sell for accounts with recurring, high-stakes travel.
 *
 * The primary CTA opens the multi-step business lead modal (LeadModal →
 * /api/leads); the Cal.com callback booking is a later slice.
 */

const STEPS = [
  {
    title: 'Send us the route',
    body: 'The trip your team needs and the points or programs you hold. One request, then forget it.',
  },
  {
    title: 'A specialist takes it from here',
    body: 'Your specialist works 30+ programs and transfer partners for real, bookable business-class space, not the phantom seats the tools surface.',
  },
  {
    title: 'You get proof to book',
    body: 'A screenshot and the exact point cost, per seat. Reliable enough to plan a whole team’s travel around.',
  },
];

const ctaBase =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors';

export default function BusinessBody() {
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
            Account-level search, handled by a specialist
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

      {/* Institutional value — the higher-value audience gets numbers and a
          reporting angle, so Business reads differently from Individual (§4/§5). */}
      <section className="relative" style={{ borderTop: '1px solid var(--sm-glass-border)', background: 'var(--sm-surface-raised)' }}>
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <motion.div variants={entrance} {...inViewOnce} className="max-w-2xl">
            <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
              What account-level search is worth
            </p>
            <h2 className="mt-3 font-display text-section font-bold text-ink">
              One quarter of team travel, on points instead of cash.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-sub">
              An illustrative quarter — the kind of spread a specialist turns into
              bookable business-class space across your team’s routes.
            </p>
          </motion.div>

          <motion.div variants={entrance} {...inViewOnce} className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
              <thead>
                <tr className="text-ink-muted" style={{ borderBottom: '1px solid var(--sm-glass-border)' }}>
                  <th className="py-2.5 pr-4 font-mono text-[0.62rem] font-medium uppercase tracking-[0.12em]">Route</th>
                  <th className="py-2.5 pr-4 font-mono text-[0.62rem] font-medium uppercase tracking-[0.12em]">Team</th>
                  <th className="py-2.5 pr-4 text-right font-mono text-[0.62rem] font-medium uppercase tracking-[0.12em]">Cash fare</th>
                  <th className="py-2.5 text-right font-mono text-[0.62rem] font-medium uppercase tracking-[0.12em]">On points</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { route: 'SFO → LHR · Business', team: '4 seats', cash: '$34,800', points: '320,000 pts' },
                  { route: 'LAX → NRT · Business', team: '3 seats', cash: '$18,600', points: '225,000 pts' },
                  { route: 'JFK → GRU · Business', team: '2 seats', cash: '$9,400', points: '150,000 pts' },
                ].map((r) => (
                  <tr key={r.route} style={{ borderBottom: '1px solid var(--sm-glass-border)' }}>
                    <td className="py-3 pr-4 text-ink">{r.route}</td>
                    <td className="py-3 pr-4 text-ink-sub">{r.team}</td>
                    <td className="py-3 pr-4 text-right text-ink-muted line-through">{r.cash}</td>
                    <td className="py-3 text-right font-mono font-semibold text-ink">{r.points}</td>
                  </tr>
                ))}
                <tr>
                  <td className="py-3 pr-4 font-medium text-ink" colSpan={2}>Quarter total</td>
                  <td className="py-3 pr-4 text-right text-ink-muted line-through">$62,800</td>
                  <td className="py-3 text-right font-mono font-semibold text-ink">695,000 pts</td>
                </tr>
              </tbody>
            </table>
          </motion.div>

          <motion.p variants={entrance} {...inViewOnce} className="mt-6 text-sm leading-relaxed text-ink-sub">
            One invoice, the point cost per traveller, and a summary your finance team
            can sign off — not a pile of receipts. Billed per search, never per seat.
          </motion.p>
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
                <span className="text-sm text-ink-sub">flat, per search</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-sub">
                Charged once, when you submit. No subscription, no retainer. The
                account-level entry point for a team that flies often.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setLeadOpen(true)}
                  className={`${ctaBase} sm-cta`}
                >
                  Start a business search
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
            Recurring routes, watched by a person
          </motion.h2>
          <motion.p
            variants={entrance}
            {...inViewOnce}
            className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-ink-sub"
          >
            For accounts with high-stakes travel that repeats, the Human Search Alert
            keeps a specialist on your routes every cycle. $99.99/mo, cancel anytime.
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

      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} type="business" />
    </>
  );
}
