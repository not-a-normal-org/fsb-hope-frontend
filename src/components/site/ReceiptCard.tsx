import { Check } from 'lucide-react';

import type { Messages } from '@/i18n/messages/en';

/**
 * Pricing-hero artifact (Review v3 §4) — a receipt that makes the charge flow
 * concrete: $25 deposit → $99 on confirmation → $0 if nothing's found. Static,
 * token-based, mode-safe (the amber cue is --sm-proof, hueless in Mono). No
 * fabricated proof: it's an illustration of the model, not a real transaction.
 */
export default function ReceiptCard({ m }: { m: Messages['receipt'] }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 sm:p-6"
      style={{
        background:
          'linear-gradient(135deg, var(--sm-bg-elevated) 0%, var(--sm-bg-base) 62%, color-mix(in srgb, var(--sm-proof) 12%, var(--sm-bg-base)) 100%)',
        border: '1px solid var(--sm-glass-border)',
        boxShadow: 'var(--sm-glass-shadow), inset 0 1px 0 rgba(255,255,255,0.10)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 52%)' }}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-muted">
            {m.heading}
          </span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.08em]"
            style={{
              color: 'var(--sm-proof)',
              background: 'var(--sm-proof-soft)',
              border: '1px solid color-mix(in srgb, var(--sm-proof) 40%, transparent)',
            }}
          >
            <Check className="h-3 w-3" aria-hidden strokeWidth={3} />
            {m.badge}
          </span>
        </div>

        <div className="mt-5 space-y-4">
          {m.rows.map((r, i) => (
            <div key={r.amount} className={i > 0 ? 'border-t pt-4' : ''} style={i > 0 ? { borderColor: 'var(--sm-glass-border)' } : undefined}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-ink-sub">{r.label}</span>
                <span className="font-mono text-2xl font-semibold text-ink">{r.amount}</span>
              </div>
              <p className="mt-1 text-xs text-ink-muted">{r.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
