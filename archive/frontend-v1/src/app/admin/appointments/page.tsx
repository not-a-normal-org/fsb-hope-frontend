import { Calendar, ExternalLink } from 'lucide-react';

// Appointments/bookings live in Cal.com, not in our database. This page reads
// them through the Cal.com API v2 when CAL_API_KEY is configured. Without a key
// it shows a setup state rather than fabricating data.

export const dynamic = 'force-dynamic';

const CAL_API_KEY     = process.env.CAL_API_KEY;
const CAL_API_VERSION = process.env.CAL_API_VERSION ?? '2024-08-13';
const CAL_DASHBOARD   = 'https://app.cal.com/bookings/upcoming';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Booking {
  id: string;
  title: string;
  start: string | null;
  end: string | null;
  status: string;
  attendeeName: string | null;
  attendeeEmail: string | null;
}

interface FetchResult {
  configured: boolean;
  bookings: Booking[];
  error?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(iso));
}

const STATUS_STYLES: Record<string, string> = {
  accepted:  'bg-green-500/10  text-green-400  border border-green-500/20',
  pending:   'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  cancelled: 'bg-red-500/10    text-red-400    border border-red-500/20',
  rejected:  'bg-red-500/10    text-red-400    border border-red-500/20',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status.toLowerCase()] ?? 'bg-[#1E2538] text-[#5C6378]'}`}>
      {status}
    </span>
  );
}

// Cal.com v2 responses vary by version; map defensively.
function mapBooking(raw: unknown): Booking {
  const b = (raw ?? {}) as Record<string, unknown>;
  const attendees = Array.isArray(b.attendees) ? (b.attendees as Record<string, unknown>[]) : [];
  const first = attendees[0] ?? {};
  return {
    id:            String(b.uid ?? b.id ?? ''),
    title:         String(b.title ?? 'Booking'),
    start:         (b.start as string) ?? (b.startTime as string) ?? null,
    end:           (b.end as string) ?? (b.endTime as string) ?? null,
    status:        String(b.status ?? 'unknown'),
    attendeeName:  (first.name as string) ?? null,
    attendeeEmail: (first.email as string) ?? null,
  };
}

// ── Data fetching ─────────────────────────────────────────────────────────────

async function fetchBookings(): Promise<FetchResult> {
  if (!CAL_API_KEY) {
    return { configured: false, bookings: [] };
  }

  try {
    const res = await fetch('https://api.cal.com/v2/bookings?take=100&sortStart=desc', {
      headers: {
        Authorization:     `Bearer ${CAL_API_KEY}`,
        'cal-api-version': CAL_API_VERSION,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { configured: true, bookings: [], error: `Cal.com API returned ${res.status}` };
    }

    const json = (await res.json()) as { data?: unknown };
    const raw = Array.isArray(json.data) ? json.data : [];
    return { configured: true, bookings: raw.map(mapBooking) };
  } catch (err) {
    return { configured: true, bookings: [], error: (err as Error).message };
  }
}

// ── Not-configured state ────────────────────────────────────────────────────

function SetupState() {
  return (
    <div className="bg-[#13182A] border border-[#1E2538] rounded-2xl px-8 py-12 text-center max-w-xl mx-auto">
      <div className="w-12 h-12 rounded-full bg-[#E8963A]/10 flex items-center justify-center mx-auto mb-4">
        <Calendar size={22} className="text-[#E8963A]" />
      </div>
      <h2 className="text-lg font-semibold text-[#F5F5F0] mb-2">Connect Cal.com to see bookings</h2>
      <p className="text-sm text-[#9DA3B4] leading-relaxed mb-6">
        Appointments are managed in Cal.com. Add a <code className="text-[#E8963A] bg-[#0E1220] px-1.5 py-0.5 rounded">CAL_API_KEY</code> to
        your environment to pull upcoming bookings in here, or open the Cal.com dashboard directly.
      </p>
      <a
        href={CAL_DASHBOARD}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-[#07090F] bg-[#E8963A] hover:bg-[#F2AA5E] transition-colors"
      >
        Open Cal.com dashboard
        <ExternalLink size={15} />
      </a>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AppointmentsPage() {
  const { configured, bookings, error } = await fetchBookings();

  if (!configured) {
    return <SetupState />;
  }

  return (
    <div className="space-y-6">

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
          Couldn&apos;t load bookings from Cal.com: {error}
        </div>
      )}

      {/* Count stat */}
      <div className="inline-block bg-[#13182A] border border-[#1E2538] rounded-xl px-6 py-4">
        <p className="text-[10px] uppercase tracking-widest text-[#5C6378] mb-1.5">Bookings</p>
        <p className="text-3xl font-bold text-[#F5F5F0] tabular-nums">{bookings.length.toLocaleString('en-AU')}</p>
      </div>

      {/* Table */}
      <div className="bg-[#13182A] border border-[#1E2538] rounded-2xl overflow-hidden">
        {bookings.length === 0 ? (
          <p className="text-center text-sm text-[#5C6378] py-16">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2538]">
                  {['Event', 'Attendee', 'Starts', 'Ends', 'Status'].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#5C6378] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr
                    key={b.id || i}
                    className={`transition-colors hover:bg-[#0E1220] ${i < bookings.length - 1 ? 'border-b border-[#1E2538]' : ''}`}
                  >
                    {/* Event */}
                    <td className="px-5 py-3.5 font-medium text-[#F5F5F0] leading-tight">{b.title}</td>
                    {/* Attendee */}
                    <td className="px-5 py-3.5">
                      <p className="text-[#9DA3B4] leading-tight">
                        {b.attendeeName ?? <span className="text-[#5C6378]">—</span>}
                      </p>
                      <p className="text-xs text-[#5C6378] mt-0.5">{b.attendeeEmail ?? '—'}</p>
                    </td>
                    {/* Starts */}
                    <td className="px-5 py-3.5 text-[#9DA3B4] tabular-nums whitespace-nowrap text-xs">
                      {fmtDateTime(b.start)}
                    </td>
                    {/* Ends */}
                    <td className="px-5 py-3.5 text-[#9DA3B4] tabular-nums whitespace-nowrap text-xs">
                      {fmtDateTime(b.end)}
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
