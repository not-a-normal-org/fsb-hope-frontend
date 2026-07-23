import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Email helpers ─────────────────────────────────────────────────────────────

function applicantEmail(firstName: string, tier: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Application Received</title>
</head>
<body style="margin:0;padding:0;background-color:#07090F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#07090F;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

          <!-- Logo / brand -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <p style="margin:0;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#E8963A;font-family:'Courier New',monospace;">
                POINTIQ
              </p>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background-color:#0E1220;border:1px solid #1E2538;border-radius:16px;padding:40px 36px;">

              <!-- Heading -->
              <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#F5F5F0;">
                Hi ${firstName},
              </p>
              <p style="margin:0 0 28px;font-size:15px;color:#9DA3B4;line-height:1.6;">
                We've received your application for the
                <strong style="color:#E8963A;text-transform:capitalize;">${tier}</strong>
                membership tier.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #1E2538;margin:0 0 28px;" />

              <!-- What happens next -->
              <p style="margin:0 0 12px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#E8963A;font-family:'Courier New',monospace;">
                What happens next
              </p>
              <table cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1E2538;">
                    <p style="margin:0;font-size:14px;color:#F5F5F0;">
                      <span style="color:#E8963A;margin-right:10px;">01</span>
                      We'll review your application within <strong>2 business days</strong>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #1E2538;">
                    <p style="margin:0;font-size:14px;color:#F5F5F0;">
                      <span style="color:#E8963A;margin-right:10px;">02</span>
                      We'll reach out via <strong>email and phone</strong> to discuss next steps
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <p style="margin:0;font-size:14px;color:#F5F5F0;">
                      <span style="color:#E8963A;margin-right:10px;">03</span>
                      We'll walk you through how the membership works for your business
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Sign off -->
              <p style="margin:32px 0 0;font-size:14px;color:#9DA3B4;line-height:1.6;">
                If you have any questions in the meantime, reply to this email and we'll get back to you.
                <br /><br />
                Looking forward to welcoming you,<br />
                <strong style="color:#F5F5F0;">PointIQ Team</strong>
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#5C6378;">
                © 2026 PointIQ · Australia
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

function adminEmail(data: {
  fullName: string;
  email: string;
  phone: string;
  companyName: string;
  businessType: string;
  annualSpend: string;
  abn: string;
  goals: string;
  selectedTier: string;
  referralSource: string;
}): string {
  const adminUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/admin/applications`;
  const rows = [
    ['Name',           data.fullName],
    ['Email',          data.email],
    ['Phone',          data.phone],
    ['Company',        data.companyName],
    ['Business Type',  data.businessType],
    ['Annual Spend',   data.annualSpend],
    ['ABN',            data.abn || '—'],
    ['Tier',           data.selectedTier],
    ['Referral',       data.referralSource],
    ['Goals',          data.goals || '—'],
  ];

  const rowsHtml = rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 14px;font-size:12px;color:#9DA3B4;white-space:nowrap;border-bottom:1px solid #1E2538;font-family:'Courier New',monospace;text-transform:uppercase;letter-spacing:1px;">${label}</td>
      <td style="padding:10px 14px;font-size:14px;color:#F5F5F0;border-bottom:1px solid #1E2538;">${value}</td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Application</title></head>
<body style="margin:0;padding:0;background-color:#07090F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#07090F;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#E8963A;font-family:'Courier New',monospace;">
                POINTIQ · ADMIN
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#0E1220;border:1px solid #1E2538;border-radius:16px;padding:36px;">
              <p style="margin:0 0 24px;font-size:20px;font-weight:600;color:#F5F5F0;">
                New Application — <span style="color:#E8963A;text-transform:capitalize;">${data.selectedTier}</span>
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1E2538;border-radius:8px;overflow:hidden;">
                ${rowsHtml}
              </table>

              <table cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td>
                    <a href="${adminUrl}"
                       style="display:inline-block;background-color:#E8963A;color:#07090F;font-weight:600;font-size:13px;padding:12px 24px;border-radius:8px;text-decoration:none;">
                      View in Admin Panel →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    fullName,
    email,
    phone,
    companyName,
    businessType,
    annualSpend,
    abn,
    goals,
    selectedTier,
    referralSource,
  } = body as Record<string, string>;

  // Validate required fields
  if (!fullName || !email || !phone || !companyName || !businessType || !annualSpend || !selectedTier) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Check for duplicate pending/active application
  const { data: existing } = await supabaseAdmin
    .from('customers')
    .select('id, status')
    .eq('email', email)
    .in('status', ['pending', 'active'])
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: 'An application with this email is already pending or active.' },
      { status: 409 },
    );
  }

  // Insert into customers
  const { error: customerError } = await supabaseAdmin
    .from('customers')
    .insert({
      email,
      full_name:          fullName,
      phone,
      company_name:       companyName,
      business_type:      businessType,
      annual_spend_range: annualSpend,
      abn:                abn || null,
      notes:              goals || null,
      tags:               [selectedTier, referralSource].filter(Boolean),
      status:             'pending',
    });

  if (customerError) {
    console.error('[api/apply] customers insert error:', customerError.message);
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
  }

  // Upsert into newsletter_subscribers
  const { error: newsletterError } = await supabaseAdmin
    .from('newsletter_subscribers')
    .upsert(
      { email, full_name: fullName, source: 'application' },
      { onConflict: 'email' },
    );

  if (newsletterError) {
    // Non-fatal — log and continue
    console.warn('[api/apply] newsletter upsert warning:', newsletterError.message);
  }

  // Send emails via Resend
  const firstName = fullName.split(' ')[0];
  const adminEmailAddress = process.env.ADMIN_EMAIL ?? 'admin@pointiq.club';

  const [applicantResult, adminResult] = await Promise.allSettled([
    resend.emails.send({
      from:    'PointIQ <hello@pointiq.club>',
      to:      email,
      subject: 'Your application to PointIQ has been received',
      html:    applicantEmail(firstName, selectedTier),
    }),
    resend.emails.send({
      from:    'PointIQ <hello@pointiq.club>',
      to:      adminEmailAddress,
      subject: `New membership application — ${fullName} (${selectedTier})`,
      html:    adminEmail({ fullName, email, phone, companyName, businessType, annualSpend, abn: abn ?? '', goals: goals ?? '', selectedTier, referralSource: referralSource ?? '' }),
    }),
  ]);

  if (applicantResult.status === 'rejected') {
    console.error('[api/apply] applicant email error:', applicantResult.reason);
  }
  if (adminResult.status === 'rejected') {
    console.error('[api/apply] admin email error:', adminResult.reason);
  }

  return NextResponse.json({ success: true });
}
