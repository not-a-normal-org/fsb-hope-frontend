'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';

/**
 * /business body (docs/plans/02): ROI / account-level framing, the $25-per-search
 * model explained plainly (full breakdown on /pricing), and the Human Search
 * Alert cross-sell for accounts with recurring, high-stakes travel.
 *
 * The multi-step lead form and the Cal.com callback booking are deferred to the
 * backend phase; the primary CTA is an interim mailto until they ship.
 */
const START = 'mailto:hello@savermiles.com?subject=Business%20Search';

const STEPS = [
  {
    title: 'Send us the route',
    body: 'The trip your team needs and the points or programs you hold. One request — no procurement dance.',
  },
  {
    title: 'We search by hand',
    body: 'A person searches 30+ programs and transfer partners for real, bookable business-class space — not the phantom seats tools surface.',
  },
  {
    title: 'You get proof to book',
    body: 'A screenshot and the exact point cost, per seat. Reliable enough to plan a team’s travel around.',
  },
];

const ctaBase =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors';

export default function BusinessBody() {
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
            Account-level search, done by hand
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
                <span className="text-sm text-ink-sub">flat, per search</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-sub">
                Charged once, when you submit — no subscription, no retainer. The
                account-level entry point for a team that flies often.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href={START}
                  className={`${ctaBase} sm-cta`}
                >
                  Start a business search
                </a>
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
            puts a real person on your routes every cycle — $99.99/mo, cancel anytime.
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
    </>
  );
}
