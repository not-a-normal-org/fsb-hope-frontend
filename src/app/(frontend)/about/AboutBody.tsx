'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import StatStrip from '@/components/site/StatStrip';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';

/**
 * /about body (docs/plans/02): mission, the manual-search differentiator, and
 * experience stats — no founder names, no prior company, no fabricated proof
 * (docs/plans/00). Transparent about the flat-fee model as the trust asset for
 * a brand with no public track record yet.
 *
 * Client component so StatStrip (framer-motion) and the section entrances work;
 * the page shell + hero stay server-rendered.
 */
const HOW = [
  {
    title: 'A specialist, not a feed',
    body: 'Award space changes by the minute and cached data lies. Your specialist works 30+ programs and transfer partners, including the routings automated tools skip.',
  },
  {
    title: 'Verified before you commit',
    body: 'Your specialist opens the booking and confirms the seat is really there, at the price we quoted, before you spend a point or a dollar.',
  },
  {
    title: 'Delivered as proof',
    body: 'You get a screenshot and the exact point cost, something you can book, not a lead or a maybe.',
  },
];

const ctaBase =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors';

export default function AboutBody() {
  return (
    <>
      <section className="relative">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <motion.p
            variants={entrance}
            {...inViewOnce}
            className="font-display text-section font-bold leading-snug text-ink"
          >
            Most people are sitting on points they can’t turn into anything good.
          </motion.p>
          <motion.p
            variants={entrance}
            {...inViewOnce}
            className="mt-5 text-base leading-relaxed text-ink-sub"
          >
            The tools that are supposed to help are quick, cheap, and full of seats that
            vanish the moment you try to book them. We built Saver Miles to fix that:
            assign you a specialist, get the most out of what you already hold, verify
            before you pay, and hand you a seat you can actually book.
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
            How we actually work
          </motion.h2>
          <motion.div
            variants={staggerParent}
            {...inViewOnce}
            className="mt-10 grid gap-6 md:grid-cols-3"
          >
            {HOW.map((h) => (
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
            The numbers behind it
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
            <h2 className="font-display text-section font-bold text-ink">How we charge</h2>
            <p className="mt-5 text-base leading-relaxed text-ink-sub">
              Flat fees for the work, listed in full on the pricing page. A business
              search is $25. An individual booking is a $25 deposit plus a $99 fee, and
              if your specialist finds nothing bookable, the deposit comes back. Ongoing
              alerts are monthly. That’s the whole model, nothing hidden.
            </p>
            <Link
              href="/pricing"
              className={`mt-7 ${ctaBase} sm-cta-ghost`}
            >
              See full pricing
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
            Put a specialist on your points.
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
              Check your route
            </Link>
            <Link
              href="/how-it-works"
              className={`${ctaBase} sm-cta-ghost`}
            >
              See how it works
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
