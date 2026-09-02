import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AlertsPreferencesBody {
  fullName?: string;
  email?: string;
  phone?: string;
  routes?: string;
  notes?: string;
  reference?: string;
}

// ── Validation ────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: AlertsPreferencesBody;
  try {
    body = (await req.json()) as AlertsPreferencesBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const fullName = body.fullName?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const routes = body.routes?.trim() ?? '';

  if (!fullName) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!routes) {
    return NextResponse.json({ error: 'Please list at least one route to monitor.' }, { status: 400 });
  }

  const phone = body.phone?.trim() ?? '';
  const notes = body.notes?.trim() ?? '';
  const reference = body.reference?.trim() ?? '';

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 'your_resend_key') {
    console.warn('[api/alerts-preferences] RESEND_API_KEY not configured — skipping email send.');
    return NextResponse.json({ success: true });
  }

  const resend = new Resend(apiKey);
  const adminEmailAddress = process.env.ADMIN_EMAIL ?? 'admin@savermiles.com';
  const firstName = fullName.split(' ')[0];

  const adminHtml = `
    <h2>New Alert Service preferences — ${esc(fullName)}</h2>
    <p><strong>Email:</strong> ${esc(email)}</p>
    ${phone ? `<p><strong>Phone (SMS):</strong> ${esc(phone)}</p>` : ''}
    ${reference ? `<p><strong>Subscription ref:</strong> ${esc(reference)}</p>` : ''}
    <p><strong>Routes to monitor:</strong><br/>${esc(routes)}</p>
    <p><strong>Notes:</strong><br/>${esc(notes) || '—'}</p>
  `;

  const customerHtml = `
    <p>Hi ${esc(firstName)},</p>
    <p>Thanks — your Seat Alert preferences are set. We'll start monitoring your routes and let you
    know the moment a Business Class award seat appears.</p>
    <p>You can update your routes any time by replying to this email.</p>
    <p>— Saver Miles</p>
  `;

  const [adminResult, customerResult] = await Promise.allSettled([
    resend.emails.send({
      from: 'Saver Miles <hello@savermiles.com>',
      to: adminEmailAddress,
      subject: `Alert preferences — ${fullName}`,
      html: adminHtml,
    }),
    resend.emails.send({
      from: 'Saver Miles <hello@savermiles.com>',
      to: email,
      subject: 'Your seat alerts are set up',
      html: customerHtml,
    }),
  ]);

  if (adminResult.status === 'rejected') {
    console.error('[api/alerts-preferences] admin email error:', adminResult.reason);
  }
  if (customerResult.status === 'rejected') {
    console.error('[api/alerts-preferences] customer email error:', customerResult.reason);
  }

  return NextResponse.json({ success: true });
}
