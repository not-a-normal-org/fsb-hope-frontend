/**
 * Illustrative example reports for the hero's region-tabbed cards. These are
 * clearly-labelled EXAMPLES of the deliverable (see SearchReportCard) — never
 * presented as a specific real customer's booking (no fabricated proof,
 * docs/plans/00). Values are plausible/representative, not a live feed.
 *
 * Numbers and dates are raw so the card can format them for the reader's locale;
 * region names and card labels live in the message dictionaries (`report`).
 */

export type RegionKey = 'asia' | 'europe' | 'australia' | 'africa' | 'americas';

export interface FlightReport {
  id: string;
  from: string; // origin airport code
  to: string; // destination airport code
  airline: string;
  cabin: 'economy' | 'premium' | 'business' | 'first';
  date: string; // ISO date; the card shows day + month only
  points: number;
  taxesUsd: number;
  retailUsd: number;
  transfer: string; // e.g. "Amex MR · 1:1" — program names, never translated
  seats: number;
}

export interface Region {
  key: RegionKey;
  report: FlightReport;
}

export const REGIONS: Region[] = [
  {
    key: 'asia',
    report: {
      id: '4412',
      from: 'JFK',
      to: 'NRT',
      airline: 'ANA',
      cabin: 'business',
      date: '2026-10-24',
      points: 75000,
      taxesUsd: 64.3,
      retailUsd: 6240,
      transfer: 'Amex MR · 1:1',
      seats: 1,
    },
  },
  {
    key: 'europe',
    report: {
      id: '4531',
      from: 'JFK',
      to: 'CDG',
      airline: 'Air France',
      cabin: 'business',
      date: '2026-11-12',
      points: 53000,
      taxesUsd: 228,
      retailUsd: 5800,
      transfer: 'Amex MR → Flying Blue · 1:1',
      seats: 2,
    },
  },
  {
    key: 'australia',
    report: {
      id: '4487',
      from: 'LAX',
      to: 'SYD',
      airline: 'Qantas',
      cabin: 'business',
      date: '2027-02-03',
      points: 108000,
      taxesUsd: 180,
      retailUsd: 8100,
      transfer: 'Citi TYP → Qantas · 1:1',
      seats: 1,
    },
  },
  {
    key: 'africa',
    report: {
      id: '4560',
      from: 'JFK',
      to: 'JNB',
      airline: 'United',
      cabin: 'business',
      date: '2027-03-18',
      points: 88000,
      taxesUsd: 210,
      retailUsd: 7400,
      transfer: 'Chase UR → United · 1:1',
      seats: 1,
    },
  },
  {
    key: 'americas',
    report: {
      id: '4602',
      from: 'JFK',
      to: 'GRU',
      airline: 'LATAM',
      cabin: 'business',
      date: '2027-01-09',
      points: 75000,
      taxesUsd: 95,
      retailUsd: 5200,
      transfer: 'Capital One → 1:1',
      seats: 1,
    },
  },
];
