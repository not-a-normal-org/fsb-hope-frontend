'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import { entrance, inViewOnce } from '@/lib/animations';

/**
 * Pricing band — replaces the duplicate mid-page newsletter (the footer keeps
 * one). The headline number is a weapon against $70–395 operators, so it belongs
 * on the home page. Copy tracks docs/plans/03 §2: $99 flat success fee per person,
 * per direction, all cabins, charged only on a confirmed booking — with the
 * refundable $25 deposit stated plainly (never buried), per the copy rule.
 */
export default function PricingBand() {
  return (
    <section className="relative border-y bg-surface-accent" style={{ borderColor: 'var(--sm-glass-border)' }}>
      <motion.div
        variants={entrance}
        {...inViewOnce}
        className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24"
      >
        <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
          Straightforward pricing
        </p>
        <h2
          className="mt-4 font-display font-bold text-ink"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
        >
          $99 per person, per direction. All cabins.{' '}
          <span className="text-accent">Only if you fly.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-sub">
          A $25 deposit starts your search — refunded in full if we find nothing bookable. The $99
          success fee is charged only once your seat is confirmed.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/audit"
            className="sm-cta rounded-full px-6 py-3 text-[14.5px] font-medium transition-colors"
          >
            Get a free points audit
          </Link>
          <Link
            href="/pricing"
            className="sm-cta-ghost rounded-full px-6 py-3 text-[14.5px] font-medium"
          >
            See full pricing
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
