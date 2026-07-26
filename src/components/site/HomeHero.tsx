'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import AmbientBackground from '@/components/system/AmbientBackground';
import GlassPanel from '@/components/system/GlassPanel';
import ShineText from '@/components/system/ShineText';
import StatStrip from './StatStrip';
import { entrance, staggerParent } from '@/lib/animations';

/**
 * Home hero — docs/plans/02 (Home) + sample.html reference copy.
 *
 * Manual-first positioning: a real person searches, no AI claim (the AI product
 * is post-launch and not advertised — docs/plans/00-context.md). One orchestrated
 * entrance: glass panel → stat strip → CTA row (spec §5).
 */
export default function HomeHero() {
  return (
    <section className="relative overflow-hidden">
      <AmbientBackground variant="hero" />
      {/* Radial-gradient wash behind the blobs, per the mockup. */}
      <div className="pointer-events-none absolute inset-0 -z-20" style={{ background: 'var(--sm-bg-gradient)' }} />

      <motion.div
        variants={staggerParent}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl px-6 pb-24 pt-24 md:pb-32 md:pt-28"
      >
        <motion.div variants={entrance}>
          <GlassPanel maxWidth="max-w-2xl" padding="p-9 sm:p-11">
            <p className="font-mono text-eyebrow font-medium uppercase text-accent">
              Your Own Points Specialist
            </p>

            <ShineText as="h1" className="mt-4 text-hero font-bold">
              The award system is broken. Your specialist makes it work for you.
            </ShineText>

            <p className="mt-5 max-w-[42ch] text-[15px] leading-relaxed text-ink-sub">
              Tell us your plans and forget them. A specialist is assigned to
              your account, works every major loyalty program, and gets the most
              out of the points you already hold. You get a seat worth flying and
              the exact cost to book it.
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link
                href="/individual"
                className="rounded-full px-6 py-3 text-[14.5px] font-medium transition-colors sm-cta"
              >
                Get a free points audit
              </Link>
              <Link
                href="/how-it-works"
                className="sm-cta-ghost rounded-full px-6 py-3 text-[14.5px] font-medium"
              >
                See How It Works
              </Link>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div variants={entrance} className="mt-11">
          <StatStrip />
        </motion.div>
      </motion.div>
    </section>
  );
}
