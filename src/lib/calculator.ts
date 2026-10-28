/**
 * Points-value calculator logic — docs/plans/05-calculator-spec.md.
 *
 * ⚠️ PLACEHOLDER NUMBERS. The valuation and threshold tables below are
 * illustrative industry-typical figures, NOT verified against real redemption
 * data. Per the spec, do NOT present this as precise, and replace these tables
 * with Saver Miles' real search history before the calculator goes to public
 * traffic — a wrong estimate undermines the "real numbers, not guesses" promise.
 * The non-collapsible disclaimer must always render with the output.
 *
 * Labels, the flight-equivalent wording, and the disclaimer live in the message
 * dictionaries (`calculator.widget`); this file keeps only the numbers.
 */
import { formatPrice } from '@/i18n/format';
import type { Locale } from '@/i18n/config';

export type ProgramKey = 'flexible' | 'airline' | 'mixed';

/** Cents-per-point ranges by program category. */
export const PROGRAMS: { key: ProgramKey; low: number; high: number }[] = [
  { key: 'flexible', low: 1.3, high: 2.2 },
  { key: 'airline', low: 1.0, high: 1.8 },
  { key: 'mixed', low: 1.2, high: 2.0 },
];

export type FlightTier =
  | 'domesticEconomy'
  | 'domesticBusiness'
  | 'intlBusinessOneWay'
  | 'intlBusinessRoundTrip'
  | 'intlFirstOneWay';

/** Rough, industry-typical thresholds. Placeholder — see file header. */
const FLIGHT_TIERS: { min: number; tier: FlightTier }[] = [
  { min: 15000, tier: 'domesticEconomy' },
  { min: 50000, tier: 'domesticBusiness' },
  { min: 80000, tier: 'intlBusinessOneWay' },
  { min: 150000, tier: 'intlBusinessRoundTrip' },
  { min: 250000, tier: 'intlFirstOneWay' },
];

/** Parse a user-typed balance ("185,000", "185000") to a number, or 0. */
export function parsePoints(input: string): number {
  const n = Number(input.replace(/[^0-9]/g, ''));
  return Number.isFinite(n) ? n : 0;
}

/** Dollar-value range for a balance in a program category, as a "$low – $high" string. */
export function valueRange(points: number, program: ProgramKey, locale: Locale): string {
  const p = PROGRAMS.find((x) => x.key === program) ?? PROGRAMS[2];
  const low = Math.round((points * p.low) / 100);
  const high = Math.round((points * p.high) / 100);
  return `${formatPrice(locale, low)} – ${formatPrice(locale, high)}`;
}

/**
 * Up to two illustrative flight equivalents: the highest tier the balance clears,
 * plus the one below it. Empty if the balance clears nothing.
 */
export function flightEquivalents(points: number): FlightTier[] {
  const cleared = FLIGHT_TIERS.filter((t) => points >= t.min);
  if (cleared.length === 0) return [];
  const top = cleared[cleared.length - 1];
  const below = cleared.length >= 2 ? cleared[cleared.length - 2] : null;
  return below ? [top.tier, below.tier] : [top.tier];
}
