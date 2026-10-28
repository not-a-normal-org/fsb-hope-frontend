/**
 * Deals grid data — illustrative TYPICAL award prices, not a live availability
 * feed and not claimed bookings (Review v3 §9, and the no-fabricated-proof rule
 * in docs/plans/00-context.md). Framing is deliberately "from X pts · typical
 * {cabin} rate": a defensible price benchmark that needs no re-verification, never
 * a dated inventory claim that would reproduce the phantom-availability failure
 * mode the rest of the site argues against.
 *
 * The cash figure is the comparison that gives the points number meaning; the
 * transfer partner is revealed on hover so the tile stays clean at rest.
 *
 * Words (city names, cabin labels) come from `home.deals` and `common.cabins` in
 * the message dictionaries; numbers are formatted for the reader's locale.
 */
export type Cabin = 'economy' | 'premium' | 'business' | 'first';
export type City = 'tokyo' | 'paris' | 'sydney' | 'london' | 'lisbon';

export type Deal = {
  /** Origin IATA. */
  from: string;
  /** Destination IATA. */
  to: string;
  /** Destination city — the visual anchor of the tile. */
  city: City;
  cabin: Cabin;
  /** "from" this many points. */
  points: number;
  /** Typical retail cash fare, in USD. */
  retailUsd: number;
  /** Transfer route revealed on hover, e.g. "Amex MR → ANA · 1:1". */
  transfer: string;
  /** The one wide feature tile (spans two columns). */
  featured?: boolean;
};

export const DEALS: Deal[] = [
  {
    from: 'JFK',
    to: 'NRT',
    city: 'tokyo',
    cabin: 'business',
    points: 75000,
    retailUsd: 6200,
    transfer: 'Amex MR → ANA · 1:1',
    featured: true,
  },
  {
    from: 'JFK',
    to: 'CDG',
    city: 'paris',
    cabin: 'business',
    points: 55000,
    retailUsd: 3800,
    transfer: 'Amex MR → Flying Blue · 1:1',
  },
  {
    from: 'LAX',
    to: 'SYD',
    city: 'sydney',
    cabin: 'business',
    points: 108000,
    retailUsd: 8100,
    transfer: 'Capital One → Qantas · 1:1',
  },
  {
    from: 'JFK',
    to: 'LHR',
    city: 'london',
    cabin: 'first',
    points: 85000,
    retailUsd: 9400,
    transfer: 'Chase UR → British Airways · 1:1',
  },
  {
    from: 'EWR',
    to: 'LIS',
    city: 'lisbon',
    cabin: 'economy',
    points: 30000,
    retailUsd: 1150,
    transfer: 'Amex MR → TAP Miles&Go · 1:1',
  },
];

/** The individual lead form with the route pre-filled, so a tile hands off intent. */
export function dealHref(deal: Deal): string {
  const params = new URLSearchParams({ from: deal.from, to: deal.to });
  return `/individual?${params.toString()}`;
}
