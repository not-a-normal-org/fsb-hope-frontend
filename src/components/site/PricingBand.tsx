'use client';

import { motion } from 'framer-motion';

import LeadCta from './LeadCta';
import Link from '@/components/system/LocaleLink';
import { entrance, inViewOnce } from '@/lib/animations';
import { useI18n } from '@/i18n/LocaleProvider';
import type { Messages } from '@/i18n/messages/en';

/**
 * Pricing band — replaces the duplicate mid-page newsletter (the footer keeps
 * one). The headline number is a weapon against $70–395 operators, so it belongs
 * on the home page. Copy tracks docs/plans/03 §2: $99 flat success fee per person,
 * per direction, all cabins, charged only on a confirmed booking — with the
 * refundable $25 deposit stated plainly (never buried), per the copy rule.
 */
export default function PricingBand({ m }: { m: Messages['home']['pricingBand'] }) {
  const { common } = useI18n().m;
  return (
    <section className="relative border-y bg-surface-accent" style={{ borderColor: 'var(--sm-glass-border)' }}>
      <motion.div
        variants={entrance}
        {...inViewOnce}
        className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24"
      >
        <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">
          {m.eyebrow}
        </p>
        <h2
          className="mt-4 font-display font-bold text-ink"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', lineHeight: 1.1, letterSpacing: '-0.01em' }}
        >
          {m.title}{' '}
          <span className="text-accent">{m.titleAccent}</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-sub">
          {m.body}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <LeadCta className="sm-cta rounded-full px-6 py-3 text-[14.5px] font-medium transition-colors">
            {common.startFlightRequest}
          </LeadCta>
          <Link
            href="/pricing"
            className="sm-cta-ghost rounded-full px-6 py-3 text-[14.5px] font-medium"
          >
            {common.seeFullPricing}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
