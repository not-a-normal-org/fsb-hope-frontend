import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ResearchIntakeBody {
  fullName?: string;
  email?: string;
  pointsBalances?: string;
  destination1?: string;
  destination2?: string;
  timeframe?: string;
  flexibility?: string;
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
  let body: ResearchIntakeBody;
  try {
    body = (await req.json()) as ResearchIntakeBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const fullName = body.fullName?.trim() ?? '';
  const email = body.email?.trim() ?? '';
  const destination1 = body.destination1?.trim() ?? '';

  if (!fullName) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (!destination1) {
    return NextResponse.json({ error: 'Please enter at least one destination.' }, { status: 400 });
  }

  const details = {
    pointsBalances: body.pointsBalances?.trim() ?? '',
    destination1,
    destination2: body.destination2?.trim() ?? '',
    timeframe: body.timeframe?.trim() ?? '',
    flexibility: body.flexibility?.trim() ?? '',
    reference: body.reference?.trim() ?? '',
  };

  const adminEmailAddress = process.env.ADMIN_EMAIL ?? 'admin@savermiles.com';
  const firstName = fullName.split(' ')[0];

  const adminHtml = `
    <h2>New Research Report intake — ${esc(fullName)}</h2>
    <p><strong>Email:</strong> ${esc(email)}</p>
    ${details.reference ? `<p><strong>Order ref:</strong> ${esc(details.reference)}</p>` : ''}
    <p><strong>Points balances:</strong><br/>${esc(details.pointsBalances) || '—'}</p>
    <p><strong>Destination 1:</strong> ${esc(details.destination1)}</p>
    <p><strong>Destination 2:</strong> ${esc(details.destination2) || '—'}</p>
    <p><strong>Timeframe:</strong> ${esc(details.timeframe) || '—'}</p>
    <p><strong>Flexibility:</strong><br/>${esc(details.flexibility) || '—'}</p>
  `;

  const customerHtml = `
    <p>Hi ${esc(firstName)},</p>
    <p>Thanks — we've received your details for your Redemption Research Report. Our team will
    research your best Business Class options and send your report (PDF + a short video walkthrough)
    within <strong>5 business days</strong>.</p>
    <p>If we need anything else, we'll email you at this address.</p>
    <p>— Saver Miles</p>
  `;

  await Promise.allSettled([
    sendEmail({
      to: adminEmailAddress,
      replyTo: email,
      subject: `Research intake — ${fullName}`,
      html: adminHtml,
    }),
    sendEmail({
      to: email,
      subject: 'We’ve received your research report details',
      html: customerHtml,
    }),
  ]);

  return NextResponse.json({ success: true });
}
