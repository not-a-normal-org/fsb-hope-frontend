'use client';

import { useState } from 'react';
import Link from 'next/link';

import GlassPanel from '@/components/system/GlassPanel';
import {
  PROGRAMS,
  type ProgramKey,
  parsePoints,
  valueRange,
  flightEquivalents,
  CALCULATOR_DISCLAIMER,
} from '@/lib/calculator';

/**
 * Points-value calculator (docs/plans/05). Live-updating, no submit. A lead-gen
 * teaser, never a booking engine — it always routes toward a real search.
 *
 * variant="compact" — home teaser: balance in, one dollar range out, link to the
 *   full calculator.
 * variant="full" — /calculator: balance + program + dollar range + flight
 *   equivalents + the required disclaimer + CTA into the individual flow.
 *
 * Numbers are placeholder (see src/lib/calculator.ts) — the disclaimer is
 * mandatory and non-collapsible; do not ship without it.
 */
export default function PointsCalculator({ variant = 'full' }: { variant?: 'compact' | 'full' }) {
  const [raw, setRaw] = useState('');
  const [program, setProgram] = useState<ProgramKey>('flexible');

  const points = parsePoints(raw);
  const hasValue = points > 0;
  const range = hasValue ? valueRange(points, program) : null;
  const flights = hasValue ? flightEquivalents(points) : [];

  const inputEl = (
    <div>
      <label
        htmlFor="points-balance"
        className="mb-2 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted"
      >
        Points balance
      </label>
      <input
        id="points-balance"
        inputMode="numeric"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="185,000"
        className="w-full rounded-lg px-4 py-3 font-mono text-lg text-ink transition-colors placeholder:text-ink-muted focus:outline-none"
        style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
      />
    </div>
  );

  if (variant === 'compact') {
    return (
      <GlassPanel as="div" className="max-w-md">
        {inputEl}
        <div className="mt-5" aria-live="polite">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
            Roughly worth
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {range ?? <span className="text-ink-muted">—</span>}
          </p>
          <p className="mt-1 text-xs text-ink-muted">in travel value · estimate only</p>
        </div>
        <Link
          href="/calculator"
          className="mt-5 inline-block text-sm text-accent transition-colors hover:text-ink"
        >
          Open the full calculator →
        </Link>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel as="div" className="max-w-2xl">
      <div className="grid gap-5 sm:grid-cols-2">
        {inputEl}
        <div>
          <label
            htmlFor="points-program"
            className="mb-2 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted"
          >
            Program
          </label>
          <select
            id="points-program"
            value={program}
            onChange={(e) => setProgram(e.target.value as ProgramKey)}
            className="w-full rounded-lg px-4 py-3 text-sm text-ink transition-colors focus:outline-none"
            style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
          >
            {PROGRAMS.map((p) => (
              <option key={p.key} value={p.key} style={{ color: '#111' }}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-7 border-t pt-6" style={{ borderColor: 'var(--sm-glass-border)' }} aria-live="polite">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
          Estimated travel value
        </p>
        <p className="mt-1 font-display text-3xl font-bold text-ink">
          {range ?? <span className="text-ink-muted">Enter a balance</span>}
        </p>

        {flights.length > 0 && (
          <div className="mt-6">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
              That’s roughly enough for
            </p>
            <ul className="mt-3 space-y-2">
              {flights.map((f) => (
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
          </div>
        )}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink-muted">{CALCULATOR_DISCLAIMER}</p>

      <Link
        href="/individual"
        className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors"
        style={{ background: 'var(--sm-cta)', color: 'var(--sm-cta-text)' }}
      >
        Run a free search
      </Link>
    </GlassPanel>
  );
}
