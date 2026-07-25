'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

import GlassPanel from '@/components/system/GlassPanel';
import { entrance, DURATION } from '@/lib/animations';
import type { Product } from '@/lib/products';

/**
 * One pricing card (docs/plans/04 — this covers AlertProductCard's role too).
 *
 * Two spec-required, non-optional pieces render inline, never hidden:
 *  - the Individual refund footnote (a featured trust line, success-toned),
 *  - the Weekly Lookup phantom-flight disclosure (warning-toned), in the same
 *    view as the price — a trust requirement, not a design choice.
 *
 * Reads only tokens. Semantic status tints (success/warning) are mixed from
 * their fixed --sm-* tokens via color-mix so they hold across all three modes.
 */
export default function PriceCard({ product }: { product: Product }) {
  const isExternal = !product.cta.href.startsWith('/');
  const ctaClass =
    'inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors sm-cta';

  return (
    <motion.div variants={entrance} whileHover={{ y: -3 }} transition={{ duration: DURATION.hover }}>
      <GlassPanel as="article" className="flex h-full flex-col" padding="p-7 sm:p-8">
        <h3 className="font-display text-card font-bold text-ink">{product.name}</h3>
        <p className="mt-1.5 text-sm text-ink-sub">{product.tagline}</p>

        <div className="mt-6">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl font-medium text-ink">{product.price}</span>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-muted">
              {product.priceUnit}
            </span>
          </div>
          {product.priceSub && (
            <p className="mt-2 text-xs leading-relaxed text-ink-sub">{product.priceSub}</p>
          )}
        </div>

        <p className="mt-6 text-sm leading-relaxed text-ink-sub">{product.description}</p>

        <ul className="mt-6 space-y-2.5">
          {product.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-ink-sub">
              <span
                aria-hidden="true"
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: 'var(--sm-accent)' }}
              />
              {f}
            </li>
          ))}
        </ul>

        {product.footnote && (
          <p
            className="mt-6 rounded-lg px-3.5 py-2.5 text-sm font-medium"
            style={{
              color: 'var(--sm-success)',
              background: 'color-mix(in srgb, var(--sm-success) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--sm-success) 28%, transparent)',
            }}
          >
            {product.footnote}
          </p>
        )}

        {product.disclosure && (
          <div
            className="mt-6 rounded-lg px-3.5 py-3"
            style={{
              background: 'color-mix(in srgb, var(--sm-warning) 8%, transparent)',
              border: '1px solid color-mix(in srgb, var(--sm-warning) 28%, transparent)',
            }}
          >
            <p
              className="font-mono text-[0.62rem] uppercase tracking-[0.12em]"
              style={{ color: 'var(--sm-warning)' }}
            >
              Automated — read this
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-sub">{product.disclosure}</p>
          </div>
        )}

        <div className="mt-auto pt-7">
          {isExternal ? (
            <a href={product.cta.href} className={ctaClass}>
              {product.cta.label}
            </a>
          ) : (
            <Link href={product.cta.href} className={ctaClass}>
              {product.cta.label}
            </Link>
          )}
        </div>
      </GlassPanel>
    </motion.div>
  );
}
