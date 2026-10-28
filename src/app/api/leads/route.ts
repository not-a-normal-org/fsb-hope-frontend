import { NextRequest, NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';
import { REF_COOKIE, sanitizeRefCode } from '@/lib/referral';
import { LEAD_DETAIL_KEYS, describeLead, hasContactNumber, leadSummary } from '@/lib/leads';
import { leadEmailHtml } from '@/lib/lead-email';
import { DEFAULT_LOCALE, hasLocale } from '@/i18n/config';

/**
 * POST /api/leads — persist a lead from the individual/business search flows into
 * the Supabase `leads` table (docs/plans/06). Server-only: uses the service-role
 * admin client, which the table's RLS is otherwise locked against.
 *
 * Individual requires a route + email + WhatsApp/phone number; business/contact
 * are accepted with just an email. The DB write is the source of truth (so
 * no lead is lost); a best-effort email notification then reaches the team at
 * hello@savermiles.com — its failure never fails the request.
 *
 * Errors come back as codes, not sentences, so the form can show them in the
 * visitor's language: `invalid_request`, `invalid_email`, `missing_route`,
 * `missing_contact`, `server_error`. The page's language is stored in
 * details.locale, and a German lead's email subject starts with [DE].
 */
export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Notifications for new leads land here. */
const TEAM_INBOX = 'hello@savermiles.com';

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
  locale?: string;
  details?: Record<string, unknown>;
}


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
    return NextResponse.json({ error: 'invalid_request' }, { status: 400 });
  }

  const type =
    body.type === 'business' ? 'business' : body.type === 'contact' ? 'contact' : 'individual';

  const email = clip(body.email, 320);
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 });
  }

  const route = clip(body.route);
  if (type === 'individual' && !route) {
    return NextResponse.json({ error: 'missing_route' }, { status: 400 });
  }

  const whatsapp = clip(body.whatsapp, 40);
  if (type === 'individual' && !hasContactNumber(whatsapp)) {
    return NextResponse.json({ error: 'missing_contact' }, { status: 400 });
  }

  // Take only known detail keys, clipped — never store arbitrary client JSON.
  const rawDetails =
    body.details && typeof body.details === 'object' ? (body.details as Record<string, unknown>) : {};
  const details: Record<string, string> = {};
  for (const key of LEAD_DETAIL_KEYS) {
    const value = clip(rawDetails[key]);
    if (value) details[key] = value;
  }
  // The language comes from the validated top-level field, never from details.
  details.locale = hasLocale(body.locale) ? body.locale : DEFAULT_LOCALE;

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
    whatsapp,
    phone: clip(body.phone, 40),
    referral_code: referralCode,
    details,
  };

  const { data: saved, error } = await supabaseAdmin
    .from('leads')
    .insert(record)
    .select('created_at')
    .single();

  if (error) {
    console.error('[api/leads] insert error:', error.message);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }

  await notifyTeam({ ...record, status: 'new', created_at: saved?.created_at ?? new Date().toISOString() });

  return NextResponse.json({ ok: true }, { status: 201 });
}

/**
 * Best-effort team notification to hello@savermiles.com carrying EVERY answer
 * the lead gave — laid out by the same describeLead() the admin view uses, so the
 * email and the console never disagree. Awaited so it runs before the serverless
 * function is frozen, but its own failure is swallowed: the lead is already
 * saved, and unconfigured Gmail credentials just skip the send.
 */
async function notifyTeam(record: {
  type: string;
  status: string;
  created_at: string;
  route: string | null;
  flight_need: string | null;
  points_held: string | null;
  yearly_spend: string | null;
  points_budget: string | null;
  email: string;
  whatsapp: string | null;
  phone: string | null;
  referral_code: string | null;
  details: Record<string, string> | null;
}): Promise<void> {
  const heading = record.route ?? record.flight_need ?? record.email;
  const summary = leadSummary(record);
  const tag = record.details?.locale === 'de' ? '[DE] ' : '';

  await sendEmail({
    to: TEAM_INBOX,
    replyTo: record.email,
    subject: `${tag}New ${record.type} lead — ${heading}${summary ? ` · ${summary}` : ''}`,
    html: leadEmailHtml(record.type, heading, describeLead(record, { includeContact: true })),
  });
}
