import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

import { supabaseAdmin } from '@/lib/supabase/admin';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ContactBody {
  name?: string;
  email?: string;
  business?: string;
  spend?: string;
  message?: string;
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
  let body: ContactBody;
  try {
    body = (await req.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const name = body.name?.trim() ?? '';
  const email = body.email?.trim() ?? '';

  if (!name) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const business = body.business?.trim() ?? '';
  const spend = body.spend?.trim() ?? '';
  const message = body.message?.trim() ?? '';

  // Capture into newsletter_subscribers so no enquiry is lost even if email fails.
  const { error: dbError } = await supabaseAdmin
    .from('newsletter_subscribers')
    .upsert({ email, full_name: name, source: 'contact' }, { onConflict: 'email' });
  if (dbError) {
    console.warn('[api/contact] subscriber upsert warning:', dbError.message);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey === 'your_resend_key') {
    console.warn('[api/contact] RESEND_API_KEY not configured — skipping email send.');
    return NextResponse.json({ success: true });
  }

  const resend = new Resend(apiKey);
  const adminEmailAddress = process.env.ADMIN_EMAIL ?? 'admin@theflightsclub.com.au';
  const firstName = name.split(' ')[0];

  const adminHtml = `
    <h2>New contact enquiry — ${esc(name)}</h2>
    <p><strong>Email:</strong> ${esc(email)}</p>
    <p><strong>Business:</strong> ${esc(business) || '—'}</p>
    <p><strong>Annual spend:</strong> ${esc(spend) || '—'}</p>
    <p><strong>Message:</strong><br/>${esc(message) || '—'}</p>
  `;

  const customerHtml = `
    <p>Hi ${esc(firstName)},</p>
    <p>Thanks for reaching out to The Flights Club — we've received your message and
    will be in touch within one business day.</p>
    <p>— The Flights Club by iFLYflat</p>
  `;

  const [adminResult, customerResult] = await Promise.allSettled([
    resend.emails.send({
      from: 'The Flights Club <hello@theflightsclub.com.au>',
      to: adminEmailAddress,
      subject: `New enquiry — ${name}`,
      html: adminHtml,
    }),
    resend.emails.send({
      from: 'The Flights Club <hello@theflightsclub.com.au>',
      to: email,
      subject: 'We’ve received your message',
      html: customerHtml,
    }),
  ]);

  if (adminResult.status === 'rejected') {
    console.error('[api/contact] admin email error:', adminResult.reason);
  }
  if (customerResult.status === 'rejected') {
    console.error('[api/contact] customer email error:', customerResult.reason);
  }

  return NextResponse.json({ success: true });
}
