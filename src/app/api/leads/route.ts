import { NextRequest, NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import { REF_COOKIE, sanitizeRefCode } from '@/lib/referral';

/**
 * POST /api/leads — persist a lead from the individual/business search flows into
 * the Supabase `leads` table (docs/plans/06). Server-only: uses the service-role
 * admin client, which the table's RLS is otherwise locked against.
 *
 * Individual requires a route + email; business/contact are accepted too (the
 * business flow lands in a later slice). Email notification is deferred to the
 * Resend setup — the DB write is the source of truth so no lead is lost.
 */
export const dynamic = 'force-dynamic';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const { error } = await supabaseAdmin.from('leads').insert({
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
  });

  if (error) {
    console.error('[api/leads] insert error:', error.message);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
