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
 */
export type Cabin = 'Economy' | 'Premium' | 'Business' | 'First';

export type Deal = {
  /** Origin IATA. */
  from: string;
  /** Destination IATA. */
  to: string;
  /** Destination city — the visual anchor of the tile. */
  city: string;
  cabin: Cabin;
  /** "from" this many points. */
  points: number;
  /** Typical retail cash fare, pre-formatted (e.g. "$6,200"). */
  retail: string;
  /** Transfer route revealed on hover, e.g. "Amex MR → ANA · 1:1". */
  transfer: string;
  /** The one wide feature tile (spans two columns). */
  featured?: boolean;
};

export const DEALS: Deal[] = [
  {
    from: 'JFK',
    to: 'NRT',
    city: 'Tokyo',
    cabin: 'Business',
    points: 75000,
    retail: '$6,200',
    transfer: 'Amex MR → ANA · 1:1',
    featured: true,
  },
  {
    from: 'JFK',
    to: 'CDG',
    city: 'Paris',
    cabin: 'Business',
    points: 55000,
    retail: '$3,800',
    transfer: 'Amex MR → Flying Blue · 1:1',
  },
  {
    from: 'LAX',
    to: 'SYD',
    city: 'Sydney',
    cabin: 'Business',
    points: 108000,
    retail: '$8,100',
    transfer: 'Capital One → Qantas · 1:1',
  },
  {
    from: 'JFK',
    to: 'LHR',
    city: 'London',
    cabin: 'First',
    points: 85000,
    retail: '$9,400',
    transfer: 'Chase UR → British Airways · 1:1',
  },
  {
    from: 'EWR',
    to: 'LIS',
    city: 'Lisbon',
    cabin: 'Economy',
    points: 30000,
    retail: '$1,150',
    transfer: 'Amex MR → TAP Miles&Go · 1:1',
  },
];

/** Points with thousands separators (e.g. 75000 → "75,000"). */
export function formatPoints(n: number): string {
  return n.toLocaleString('en-US');
}

/** The audit CTA with the route pre-filled, so a tile hands off intent. */
export function dealHref(deal: Deal): string {
  const params = new URLSearchParams({ from: deal.from, to: deal.to });
  return `/individual?${params.toString()}`;
}
