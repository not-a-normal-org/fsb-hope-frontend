/**
 * Points-value calculator logic — docs/plans/05-calculator-spec.md.
 *
 * ⚠️ PLACEHOLDER NUMBERS. The valuation and threshold tables below are
 * illustrative industry-typical figures, NOT verified against real redemption
 * data. Per the spec, do NOT present this as precise, and replace these tables
 * with Saver Miles' real search history before the calculator goes to public
 * traffic — a wrong estimate undermines the "real numbers, not guesses" promise.
 * The non-collapsible disclaimer must always render with the output.
 */

export type ProgramKey = 'flexible' | 'airline' | 'mixed';

export const PROGRAMS: { key: ProgramKey; label: string; low: number; high: number }[] = [
  { key: 'flexible', label: 'Flexible / transferable (Amex, Chase, Citi, Cap One)', low: 1.3, high: 2.2 },
  { key: 'airline', label: 'A US airline program directly', low: 1.0, high: 1.8 },
  { key: 'mixed', label: 'Not sure / mixed', low: 1.2, high: 2.0 },
];

/** Rough, industry-typical thresholds. Placeholder — see file header. */
const FLIGHT_TIERS: { min: number; label: string }[] = [
  { min: 15000, label: 'a round-trip domestic economy ticket' },
  { min: 50000, label: 'a round-trip domestic business seat, or a one-way international economy ticket' },
  { min: 80000, label: 'a one-way international business-class seat' },
  { min: 150000, label: 'a round-trip international business-class trip' },
  { min: 250000, label: 'a one-way international first-class seat' },
];

/** Parse a user-typed balance ("185,000", "185000") to a number, or 0. */
export function parsePoints(input: string): number {
  const n = Number(input.replace(/[^0-9]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Dollar-value range for a balance in a program category, as a "$low – $high" string. */
export function valueRange(points: number, program: ProgramKey): string {
  const p = PROGRAMS.find((x) => x.key === program) ?? PROGRAMS[2];
  const low = Math.round((points * p.low) / 100);
  const high = Math.round((points * p.high) / 100);
  return `${usd.format(low)} – ${usd.format(high)}`;
}

/**
 * Up to two illustrative flight equivalents: the highest tier the balance clears,
 * plus the one below it. Empty if the balance clears nothing.
 */
export function flightEquivalents(points: number): string[] {
  const cleared = FLIGHT_TIERS.filter((t) => points >= t.min);
  if (cleared.length === 0) return [];
  const top = cleared[cleared.length - 1];
  const below = cleared.length >= 2 ? cleared[cleared.length - 2] : null;
  return below ? [top.label, below.label] : [top.label];
}

/** The exact, non-collapsible disclaimer required by the spec. */
export const CALCULATOR_DISCLAIMER =
  'These are estimates based on typical redemption values, not a live search. Actual value depends on real award availability on your dates. Run a free search to see what’s actually bookable.';
