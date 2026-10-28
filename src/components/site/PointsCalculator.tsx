'use client';

import { useState } from 'react';

import Link from '@/components/system/LocaleLink';
import GlassPanel from '@/components/system/GlassPanel';
import LeadCta from './LeadCta';
import { PROGRAMS, type ProgramKey, parsePoints, valueRange, flightEquivalents } from '@/lib/calculator';
import { fmt } from '@/i18n/format';
import { useI18n } from '@/i18n/LocaleProvider';
import type { Messages } from '@/i18n/messages/en';

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
export default function PointsCalculator({
  variant = 'full',
  m,
}: {
  variant?: 'compact' | 'full';
  m: Messages['calculator']['widget'];
}) {
  const { locale, m: shared } = useI18n();
  // Seed a live default so the result reads as a working example, not a broken
  // em dash. Matches the input placeholder; the user can clear/replace it.
  const [raw, setRaw] = useState(m.example);
  const [program, setProgram] = useState<ProgramKey>('flexible');

  const points = parsePoints(raw);
  const hasValue = points > 0;
  const range = hasValue ? valueRange(points, program, locale) : null;
  const flights = hasValue ? flightEquivalents(points).map((tier) => m.tiers[tier]) : [];

  const inputEl = (
    <div>
      <label
        htmlFor="points-balance"
        className="mb-2 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted"
      >
        {m.balance}
      </label>
      <input
        id="points-balance"
        inputMode="numeric"
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={m.example}
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
            {m.roughly}
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {range ?? <span className="text-ink-muted">—</span>}
          </p>
          <p className="mt-1 text-xs text-ink-muted">{m.travelValue}</p>
          {flights.length > 0 && (
            // Tie the estimate to a concrete example (Review v3 §10.3): the two
            // best interactive elements finally point at each other. The example
            // is the top tier the balance actually clears, not a fixed claim —
            // 15k points must not read as "a business seat to Tokyo."
            <Link
              href="/individual"
              className="mt-3 inline-block text-xs text-ink-sub transition-colors hover:text-ink"
            >
              {fmt(m.startThat, { flight: flights[0] })}
            </Link>
          )}
        </div>
        <Link
          href="/calculator"
          className="mt-5 inline-block text-sm text-accent transition-colors hover:text-ink"
        >
          {m.openFull}
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
            {m.program}
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
                {m.programs[p.key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-7 border-t pt-6" style={{ borderColor: 'var(--sm-glass-border)' }} aria-live="polite">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
          {m.estimated}
        </p>
        <p className="mt-1 font-display text-3xl font-bold text-ink">
          {range ?? <span className="text-ink-muted">{m.enterBalance}</span>}
        </p>

        {flights.length > 0 && (
          <div className="mt-6">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
              {m.enoughFor}
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

      <p className="mt-6 text-xs leading-relaxed text-ink-muted">{m.disclaimer}</p>

      <LeadCta className="mt-6 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors sm-cta">
        {shared.common.startFlightRequest}
      </LeadCta>
    </GlassPanel>
  );
}
