/**
 * Illustrative example reports for the hero's region-tabbed cards. These are
 * clearly-labelled EXAMPLES of the deliverable (see SearchReportCard) — never
 * presented as a specific real customer's booking (no fabricated proof,
 * docs/plans/00). Values are plausible/representative, not a live feed.
 */

export interface FlightReport {
  id: string;
  from: string; // origin airport code
  to: string; // destination airport code
  airline: string;
  cabin: string;
  date: string;
  points: string; // formatted, e.g. "75,000"
  taxes: string; // formatted with $, e.g. "$64.30"
  retailUSD: string; // formatted with $, e.g. "$6,240"
  transfer: string; // e.g. "Amex MR · 1:1"
  seatNote: string; // e.g. "1 seat · confirmed available"
}

export interface Region {
  key: string;
  label: string;
  report: FlightReport;
}

export const REGIONS: Region[] = [
  {
    key: 'asia',
    label: 'Asia',
    report: {
      id: '4412',
      from: 'JFK',
      to: 'NRT',
      airline: 'ANA',
      cabin: 'Business',
      date: '24 Oct',
      points: '75,000',
      taxes: '$64.30',
      retailUSD: '$6,240',
      transfer: 'Amex MR · 1:1',
      seatNote: '1 seat · confirmed available',
    },
  },
  {
    key: 'europe',
    label: 'Europe',
    report: {
      id: '4531',
      from: 'JFK',
      to: 'CDG',
      airline: 'Air France',
      cabin: 'Business',
      date: '12 Nov',
      points: '53,000',
      taxes: '$228',
      retailUSD: '$5,800',
      transfer: 'Amex MR → Flying Blue · 1:1',
      seatNote: '2 seats · confirmed available',
    },
  },
  {
    key: 'australia',
    label: 'Australia',
    report: {
      id: '4487',
      from: 'LAX',
      to: 'SYD',
      airline: 'Qantas',
      cabin: 'Business',
      date: '03 Feb',
      points: '108,000',
      taxes: '$180',
      retailUSD: '$8,100',
      transfer: 'Citi TYP → Qantas · 1:1',
      seatNote: '1 seat · confirmed available',
    },
  },
  {
    key: 'africa',
    label: 'Africa',
    report: {
      id: '4560',
      from: 'JFK',
      to: 'JNB',
      airline: 'United',
      cabin: 'Business',
      date: '18 Mar',
      points: '88,000',
      taxes: '$210',
      retailUSD: '$7,400',
      transfer: 'Chase UR → United · 1:1',
      seatNote: '1 seat · confirmed available',
    },
  },
];
