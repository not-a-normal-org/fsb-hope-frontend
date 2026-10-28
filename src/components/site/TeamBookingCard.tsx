import { Check, Users } from 'lucide-react';

import type { Messages } from '@/i18n/messages/en';

/**
 * Business-hero artifact (Review v3 §4) — a team booking summary, so the Business
 * page shows an institutional deliverable (multi-seat, invoiced) rather than the
 * individual report card. Illustrative, not a real client (no fabricated proof);
 * the amber cue is --sm-proof, hueless in Mono.
 */
export default function TeamBookingCard({ m }: { m: Messages['teamBooking'] }) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 sm:p-6"
      style={{
        background:
          'linear-gradient(135deg, var(--sm-bg-elevated) 0%, var(--sm-bg-base) 60%, color-mix(in srgb, var(--sm-proof) 12%, var(--sm-bg-base)) 100%)',
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
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-muted">
            <Users className="h-3.5 w-3.5" aria-hidden />
            {m.label}
          </span>
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.08em]"
            style={{
              color: 'var(--sm-proof)',
              background: 'var(--sm-proof-soft)',
              border: '1px solid color-mix(in srgb, var(--sm-proof) 40%, transparent)',
            }}
          >
            <Check className="h-3 w-3" aria-hidden strokeWidth={3} />
            {m.confirmed}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <span className="font-display text-3xl font-bold text-ink">SFO</span>
          <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: 'var(--sm-glass-border)' }} />
          <span className="font-display text-3xl font-bold text-ink">LHR</span>
        </div>
        <p className="mt-2 text-sm text-ink-sub">{m.details}</p>

        <div className="mt-5 space-y-1.5">
          <p className="font-mono text-xl font-semibold text-ink">
            {m.points} <span className="text-ink-muted">·</span> {m.seats}
          </p>
          <p className="font-mono text-base font-medium text-ink-sub">
            {m.retail} <span className="text-ink line-through decoration-2">{m.retailValue}</span>
            <span className="text-ink-muted">{m.bookedOnPoints}</span>
          </p>
        </div>

        <p className="mt-5 flex items-center gap-1.5 border-t pt-4 text-xs text-ink-sub" style={{ borderColor: 'var(--sm-glass-border)' }}>
          <Check className="h-3.5 w-3.5" style={{ color: 'var(--sm-proof)' }} aria-hidden strokeWidth={3} />
          {m.footer}
        </p>
      </div>
    </div>
  );
}
