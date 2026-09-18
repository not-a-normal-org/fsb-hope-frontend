/**
 * Shared lead constants and formatting, used by the lead API (whitelist + team
 * email), the admin Leads view, and the assignee's portal queue. Plain module (no
 * 'use server') so a client component can import the arrays directly — a const
 * exported from a server-actions file reaches the client as a server reference,
 * not the value.
 *
 * LEAD_DETAIL_FIELDS is the single source of truth for the questionnaire answers
 * stored in `leads.details` (jsonb): the API only keeps these keys, the edit
 * dialog edits them, and describeLead() lays them out for the view dialog and the
 * notification email. Adding a question means adding it here once.
 */

export const LEAD_STATUSES = ['new', 'contacted', 'searching', 'closed'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

// ── Answer options ────────────────────────────────────────────────────────────

/** `label` is what the customer picks in the form; `display` is the terse version staff read. */
export type LeadOption = { value: string; label: string; display?: string };

export const TRIP_TYPE_OPTIONS: LeadOption[] = [
  { value: 'round_trip', label: 'Round-trip' },
  { value: 'one_way', label: 'One-way' },
  { value: 'multi_city', label: 'Multi-city / open-jaw' },
];

export const ROUTE_FLEX_OPTIONS: LeadOption[] = [
  { value: 'both', label: 'Both ends — nearby airports or other cities are fine', display: 'Flexible on both ends' },
  { value: 'origin', label: 'Departure only — I can leave from another airport', display: 'Departure flexible' },
  { value: 'destination', label: 'Destination only — open to other cities', display: 'Destination flexible' },
  { value: 'fixed', label: 'Neither — these exact cities', display: 'Fixed (exact cities)' },
];

export const FLEXIBILITY_OPTIONS: LeadOption[] = [
  { value: 'flexible', label: 'Flexible — find me the best value', display: 'Flexible' },
  { value: 'fixed', label: 'Fixed — these exact dates', display: 'Fixed (exact dates)' },
  { value: 'unsure', label: 'Not sure yet' },
];

export const PASSENGER_OPTIONS: LeadOption[] = ['1', '2', '3', '4', '5', '6+'].map((v) => ({
  value: v,
  label: `${v} traveler${v === '1' ? '' : 's'}`,
}));

export const CABIN_OPTIONS: LeadOption[] = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium', label: 'Premium economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First' },
  { value: 'any', label: 'Any / best value' },
];

// ── Questionnaire fields (leads.details) ──────────────────────────────────────

export type LeadDetailField = {
  key: string;
  label: string;
  /** Which block of the view/email the answer belongs to. */
  section: 'trip' | 'notes';
  options?: LeadOption[];
  /** Multi-line answer (textarea in the edit dialog). */
  area?: boolean;
};

export const LEAD_DETAIL_FIELDS: LeadDetailField[] = [
  { key: 'origin', label: 'From', section: 'trip' },
  { key: 'destination', label: 'To', section: 'trip' },
  { key: 'route_flexibility', label: 'Route flexibility', section: 'trip', options: ROUTE_FLEX_OPTIONS },
  { key: 'trip_type', label: 'Trip type', section: 'trip', options: TRIP_TYPE_OPTIONS },
  { key: 'dates', label: 'Dates', section: 'trip' },
  { key: 'flexibility', label: 'Date flexibility', section: 'trip', options: FLEXIBILITY_OPTIONS },
  { key: 'passengers', label: 'Travelers', section: 'trip', options: PASSENGER_OPTIONS },
  { key: 'cabin', label: 'Cabin', section: 'trip', options: CABIN_OPTIONS },
  // Legacy key: accepted by the API before the form stopped asking it.
  { key: 'preferences', label: 'Preferences', section: 'notes', area: true },
  { key: 'notes', label: 'Notes / preferences', section: 'notes', area: true },
];

export const LEAD_DETAIL_KEYS = LEAD_DETAIL_FIELDS.map((f) => f.key);

/** The `route` column for leads that give From/To separately: "Denver → Amsterdam". */
export function composeRoute(origin?: string | null, destination?: string | null): string | null {
  const parts = [origin, destination].map((p) => (p ?? '').trim()).filter(Boolean);
  return parts.length ? parts.join(' → ') : null;
}

/** Staff-facing text for a stored answer; unknown values (older leads, free text) pass through. */
export function displayAnswer(field: LeadDetailField | undefined, raw: string): string {
  const opt = field?.options?.find((o) => o.value === raw);
  return opt ? (opt.display ?? opt.label) : raw;
}

// ── Formatting a lead for the view dialog and the team email ─────────────────

export type LeadRecord = {
  type?: string | null;
  status?: string | null;
  created_at?: string | null;
  route?: string | null;
  flight_need?: string | null;
  points_held?: string | null;
  yearly_spend?: string | null;
  points_budget?: string | null;
  email?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
  referral_code?: string | null;
  details?: Record<string, unknown> | null;
};

export type LeadViewRow = { label: string; value: string };
export type LeadViewSection = { title: string; rows: LeadViewRow[] };

function asText(value: unknown): string | null {
  if (value == null) return null;
  const s = (typeof value === 'object' ? JSON.stringify(value) : String(value)).trim();
  return s || null;
}

function humanizeKey(key: string): string {
  const spaced = key.replace(/[_-]+/g, ' ').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function detailsOf(lead: LeadRecord): Record<string, unknown> {
  return lead.details && typeof lead.details === 'object' ? lead.details : {};
}

export function formatReceived(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(new Date(iso)) + ' UTC';
}

/**
 * Every stored answer for a lead, grouped and labelled. Nothing is dropped:
 * details keys we don't recognise still appear under Notes, so a new form field
 * shows up for staff even before it gets a proper label here. Contact details are
 * included only when the viewer is allowed to see them.
 */
export function describeLead(lead: LeadRecord, opts: { includeContact: boolean }): LeadViewSection[] {
  const details = detailsOf(lead);
  const trip: LeadViewRow[] = [];
  const points: LeadViewRow[] = [];
  const notes: LeadViewRow[] = [];
  const contact: LeadViewRow[] = [];
  const record: LeadViewRow[] = [];

  const push = (rows: LeadViewRow[], label: string, value: unknown) => {
    const text = asText(value);
    if (text) rows.push({ label, value: text });
  };

  // Newer leads give From/To separately (and `route` is composed from them), so
  // the Route row would only repeat them; older leads have Route alone.
  if (!asText(details.origin) && !asText(details.destination)) push(trip, 'Route', lead.route);
  push(trip, 'Routes & cabins', lead.flight_need);
  for (const field of LEAD_DETAIL_FIELDS) {
    const raw = asText(details[field.key]);
    if (raw) (field.section === 'trip' ? trip : notes).push({ label: field.label, value: displayAnswer(field, raw) });
  }
  for (const [key, value] of Object.entries(details)) {
    if (!LEAD_DETAIL_KEYS.includes(key)) push(notes, humanizeKey(key), value);
  }

  push(points, 'Points held', lead.points_held);
  push(points, 'Points / budget', lead.points_budget);
  push(points, 'Annual flight spend', lead.yearly_spend);

  if (opts.includeContact) {
    push(contact, 'Email', lead.email);
    push(contact, 'WhatsApp', lead.whatsapp);
    push(contact, 'Phone', lead.phone);
  }

  push(record, 'Type', lead.type ? humanizeKey(lead.type) : null);
  push(record, 'Status', lead.status ? humanizeKey(lead.status) : null);
  push(record, 'Received', lead.created_at ? formatReceived(lead.created_at) : null);
  push(record, 'Referral code', lead.referral_code);

  return [
    { title: 'Trip', rows: trip },
    { title: 'Points & budget', rows: points },
    { title: 'Notes', rows: notes },
    { title: 'Contact', rows: contact },
    { title: 'Record', rows: record },
  ].filter((s) => s.rows.length > 0);
}

/** One-line glance summary for table rows and email subjects, e.g. "1 traveler · One-way · Business · Mid October". */
export function leadSummary(lead: LeadRecord): string {
  const details = detailsOf(lead);
  const pick = (key: string) => {
    const raw = asText(details[key]);
    return raw ? displayAnswer(LEAD_DETAIL_FIELDS.find((f) => f.key === key), raw) : null;
  };
  return [pick('passengers'), pick('trip_type'), pick('cabin'), pick('dates')].filter(Boolean).join(' · ');
}
