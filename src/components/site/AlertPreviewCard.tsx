import { BellRing, Check } from 'lucide-react';

/**
 * Alerts-hero artifact (Review v3 §4) — a mock "award space found" alert, so the
 * Alerts page shows the deliverable a specialist sends. Illustrative, clearly an
 * example (no fabricated proof); the amber cue is --sm-proof, hueless in Mono.
 */
export default function AlertPreviewCard() {
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
        <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: 'var(--sm-glass-border)' }}>
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full"
            style={{ background: 'var(--sm-proof-soft)', color: 'var(--sm-proof)' }}
            aria-hidden
          >
            <BellRing className="h-3.5 w-3.5" />
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink-muted">
            Route alert · example
          </span>
        </div>

        <h3 className="mt-4 font-display text-2xl font-bold text-ink">Award space found.</h3>
        <div className="mt-3 flex items-center gap-2">
          <span className="font-display text-xl font-bold text-ink">JFK</span>
          <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: 'var(--sm-glass-border)' }} />
          <span className="font-display text-xl font-bold text-ink">NRT</span>
        </div>
        <p className="mt-2 text-sm text-ink-sub">ANA · Business · 24 Oct · 2 seats</p>

        <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-ink-sub">
          <Check className="h-3.5 w-3.5" style={{ color: 'var(--sm-proof)' }} aria-hidden strokeWidth={3} />
          Verified by hand — a specialist confirmed it this cycle.
        </p>
      </div>
    </div>
  );
}
