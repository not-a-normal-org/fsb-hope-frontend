import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { REF_COOKIE, sanitizeRefCode } from '@/lib/referral';

/**
 * POST /api/leads — persist a lead from the individual/business search flows into
 * the Supabase `leads` table (docs/plans/06). Server-only: uses the service-role
 * admin client, which the table's RLS is otherwise locked against.
 *
 * Individual requires a route + email; business/contact are accepted too (the
 * business flow lands in a later slice). The DB write is the source of truth (so
 * no lead is lost); a best-effort Resend notification then emails the team at
 * hello@savermiles.com — its failure never fails the request.
 */
export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Notifications for new leads land here. */
const TEAM_INBOX = 'hello@savermiles.com';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
}

interface LeadBody {
  type?: string;
  route?: string;
  points_held?: string;
  yearly_spend?: string;
  flight_need?: string;
  points_budget?: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
  details?: Record<string, unknown>;
}

// Extra individual questionnaire answers stored in leads.details (jsonb).
const DETAIL_KEYS = ['dates', 'flexibility', 'passengers', 'cabin', 'preferences', 'notes'];

/** Trim, cap length, and normalise empty → null. */
function clip(value: unknown, max = 2000): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const type =
    body.type === 'business' ? 'business' : body.type === 'contact' ? 'contact' : 'individual';

  const email = clip(body.email, 320);
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const route = clip(body.route);
  if (type === 'individual' && !route) {
    return NextResponse.json({ error: 'Please tell us where you want to go.' }, { status: 400 });
  }

  // Take only known detail keys, clipped — never store arbitrary client JSON.
  const rawDetails =
    body.details && typeof body.details === 'object' ? (body.details as Record<string, unknown>) : {};
  const details: Record<string, string> = {};
  for (const key of DETAIL_KEYS) {
    const value = clip(rawDetails[key]);
    if (value) details[key] = value;
  }

  // Attribution: the affiliate's code, captured into the sm_ref cookie on landing.
  const referralCode = sanitizeRefCode(req.cookies.get(REF_COOKIE)?.value);

  const record = {
    type,
    route,
    points_held: clip(body.points_held),
    yearly_spend: clip(body.yearly_spend),
    flight_need: clip(body.flight_need),
    points_budget: clip(body.points_budget),
    email,
    whatsapp: clip(body.whatsapp, 40),
    phone: clip(body.phone, 40),
    referral_code: referralCode,
    details: Object.keys(details).length ? details : null,
  };

  const { error } = await supabaseAdmin.from('leads').insert(record);

  if (error) {
    console.error('[api/leads] insert error:', error.message);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  await notifyTeam(record);

  return NextResponse.json({ ok: true }, { status: 201 });
}

/**
 * Best-effort team notification. Awaited so it runs before the serverless
 * function is frozen, but its own failure is swallowed — the lead is already
 * saved, and a missing/placeholder RESEND_API_KEY just skips the send.
 */
async function notifyTeam(record: {
  type: string;
  route: string | null;
  points_held: string | null;
  yearly_spend: string | null;
  flight_need: string | null;
  points_budget: string | null;
  email: string;
  whatsapp: string | null;
  phone: string | null;
  referral_code: string | null;
  details: Record<string, string> | null;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 'your_resend_key') {
    console.warn('[api/leads] RESEND_API_KEY not configured — skipping team notification.');
    return;
  }

  const row = (label: string, value: string | null) =>
    value ? `<p><strong>${label}:</strong> ${esc(value)}</p>` : '';
  const detailRows = record.details
    ? Object.entries(record.details)
        .map(([k, v]) => row(k[0].toUpperCase() + k.slice(1), v))
        .join('')
    : '';

  const html = `
    <h2>New ${esc(record.type)} lead</h2>
    ${row('Email', record.email)}
    ${row('Route', record.route)}
    ${row('WhatsApp', record.whatsapp)}
    ${row('Phone', record.phone)}
    ${row('Points held', record.points_held)}
    ${row('Yearly spend', record.yearly_spend)}
    ${row('Flight need', record.flight_need)}
    ${row('Points / budget', record.points_budget)}
    ${detailRows}
    ${row('Referral', record.referral_code)}
  `;

  try {
    await new Resend(apiKey).emails.send({
      from: 'SaverMiles <hello@savermiles.com>',
      to: TEAM_INBOX,
      replyTo: record.email,
      subject: `New ${record.type} lead — ${record.route ?? record.email}`,
      html,
    });
  } catch (err) {
    console.error('[api/leads] team notification failed:', err instanceof Error ? err.message : err);
  }
}
