'use client';

import { motion } from 'framer-motion';

import Link from '@/components/system/LocaleLink';
import { entrance, staggerParent, inViewOnce } from '@/lib/animations';
import { rich } from '@/i18n/rich';
import type { Messages } from '@/i18n/messages/en';

/**
 * Home alerts teaser (docs/plans/02). The two tiers are NOT visual equals: the
 * $99.99 Human Search Alert is featured (larger, amber-bordered, "Most accurate")
 * so it reads as a different category, not a 20× markup on the $4.99 scan. The
 * $4.99 tier keeps its mandatory phantom-flight disclosure beside the price
 * (docs/plans/03 §3). The Human tier sells the process — "a specialist confirms
 * the seat" — not an invented precision stat (Review v3 §6). On a raised surface;
 * the page's one glow is the hero.
 */
export default function AlertsTeaser({
  m,
  products,
}: {
  m: Messages['home']['alertsTeaser'];
  products: Messages['products'];
}) {
  return (
    <section
      className="relative border-t"
      style={{ background: 'var(--sm-surface-raised)', borderColor: 'var(--sm-glass-border)' }}
    >
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
        <motion.div variants={entrance} {...inViewOnce} className="max-w-2xl">
          <p className="font-mono text-eyebrow uppercase tracking-[0.14em] text-accent">{m.eyebrow}</p>
          <h2 className="mt-3 font-display text-section font-bold text-ink">
            {m.title}
          </h2>
        </motion.div>

        <motion.div
          variants={staggerParent}
          {...inViewOnce}
          className="mt-10 grid items-stretch gap-6 md:grid-cols-[2fr_3fr]"
        >
          {/* Weekly Lookup Alert — the low-cost scan (decoy) */}
          <motion.div variants={entrance}>
            <div
              className="flex h-full flex-col rounded-2xl p-6 sm:p-7"
              style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-card font-bold text-ink">{products.weekly.name}</h3>
                <span className="shrink-0 font-mono text-sm text-ink-sub">{m.weeklyPrice}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-sub">
                {m.weeklyBody}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                {m.weeklyNote}
              </p>
            </div>
          </motion.div>

          {/* Human Search Alert — featured */}
          <motion.div variants={entrance}>
            <div
              className="relative flex h-full flex-col rounded-2xl p-6 sm:p-8"
              style={{
                background: 'var(--sm-bg-elevated)',
                border: '1.5px solid color-mix(in srgb, var(--sm-proof) 55%, transparent)',
                boxShadow: '0 24px 60px -28px color-mix(in srgb, var(--sm-proof) 40%, transparent)',
              }}
            >
              <span
                className="absolute -top-3 left-6 inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.1em]"
                style={{
                  color: 'var(--sm-proof)',
                  background: 'var(--sm-proof-soft)',
                  border: '1px solid color-mix(in srgb, var(--sm-proof) 45%, transparent)',
                }}
              >
                {m.badge}
              </span>
              <div className="mt-1 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-card font-bold text-ink">{products.human.name}</h3>
                <span className="shrink-0 font-mono text-sm text-ink">{m.humanPrice}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-sub">
                {rich(m.humanBody, {
                  strong: (c) => <span className="font-medium text-ink">{c}</span>,
                })}
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={entrance} {...inViewOnce} className="mt-8">
          <Link href="/alerts" className="text-sm text-ink-sub underline underline-offset-4 transition-colors hover:text-ink">
            {m.compare}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
