'use server';

import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/email';

import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { logAudit } from '@/lib/audit';
import { SITE_LEGAL_NAME, SITE_ADDRESS_INLINE } from '@/lib/constants';

// ── Email helpers ─────────────────────────────────────────────────────────────

function approvalEmail(firstName: string, tier: string, paymentLink: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Application Approved</title></head>
<body style="margin:0;padding:0;background-color:#07090F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#07090F;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <tr><td style="padding-bottom:32px;text-align:center;">
          <p style="margin:0;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#E8963A;font-family:'Courier New',monospace;">SAVER MILES</p>
        </td></tr>

        <tr><td style="background-color:#0E1220;border:1px solid #1E2538;border-radius:16px;padding:40px 36px;">

          <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#F5F5F0;">Congratulations, ${firstName}!</p>
          <p style="margin:0 0 28px;font-size:15px;color:#9DA3B4;line-height:1.6;">
            Your application for the <strong style="color:#E8963A;text-transform:capitalize;">${tier}</strong> plan
            has been approved. You're one step away from getting started with Saver Miles.
          </p>

          <hr style="border:none;border-top:1px solid #1E2538;margin:0 0 28px;" />

          <p style="margin:0 0 20px;font-size:14px;color:#F5F5F0;line-height:1.6;">
            Click the button below to complete your signup and get started.
          </p>

          <table cellpadding="0" cellspacing="0" style="margin:0 0 28px;">
            <tr><td>
              <a href="${paymentLink}"
                 style="display:inline-block;background-color:#E8963A;color:#07090F;font-weight:700;font-size:15px;padding:16px 32px;border-radius:10px;text-decoration:none;">
                Complete Your Signup →
              </a>
            </td></tr>
          </table>

          <p style="margin:0 0 28px;font-size:12px;color:#5C6378;">
            This link expires in 30 days. If it has expired, reply to this email and we'll send a new one.
          </p>

          <hr style="border:none;border-top:1px solid #1E2538;margin:0 0 24px;" />

          <p style="margin:0;font-size:13px;color:#9DA3B4;line-height:1.6;">
            Questions? Reply to this email or call us directly — we're here to help.<br /><br />
            <strong style="color:#F5F5F0;">Saver Miles Team</strong><br />
            <a href="mailto:hello@savermiles.com" style="color:#E8963A;text-decoration:none;">hello@savermiles.com</a>
          </p>

        </td></tr>

        <tr><td style="padding-top:24px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#5C6378;">© 2026 ${SITE_LEGAL_NAME} · ${SITE_ADDRESS_INLINE}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

function rejectionEmail(firstName: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Application Update</title></head>
<body style="margin:0;padding:0;background-color:#07090F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#07090F;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">

        <tr><td style="padding-bottom:32px;text-align:center;">
          <p style="margin:0;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#E8963A;font-family:'Courier New',monospace;">SAVER MILES</p>
        </td></tr>

        <tr><td style="background-color:#0E1220;border:1px solid #1E2538;border-radius:16px;padding:40px 36px;">

          <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#F5F5F0;">Hi ${firstName},</p>
          <p style="margin:0 0 24px;font-size:15px;color:#9DA3B4;line-height:1.6;">
            Thank you for your interest in Saver Miles. After reviewing your application,
            we don't think it's quite the right fit at this time.
          </p>
          <p style="margin:0 0 24px;font-size:14px;color:#9DA3B4;line-height:1.6;">
            This isn't a reflection on you or your business — our criteria are specific
            to ensure the best possible outcomes for everyone. We'd encourage you to reapply
            as your business grows, or explore our Points Concierge service in the meantime.
          </p>

          <hr style="border:none;border-top:1px solid #1E2538;margin:0 0 24px;" />

          <p style="margin:0;font-size:13px;color:#9DA3B4;line-height:1.6;">
            If you have any questions, please don't hesitate to reach out.<br /><br />
            <strong style="color:#F5F5F0;">Saver Miles Team</strong><br />
            <a href="mailto:hello@savermiles.com" style="color:#E8963A;text-decoration:none;">hello@savermiles.com</a>
          </p>

        </td></tr>

        <tr><td style="padding-top:24px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#5C6378;">© 2026 ${SITE_LEGAL_NAME} · ${SITE_ADDRESS_INLINE}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
  `.trim();
}

// ── Server Actions ────────────────────────────────────────────────────────────

export async function approveApplication(
  customerId: string,
  priceId: string,
  customerEmail: string,
  customerName: string,
  tier: string,
): Promise<void> {
  // 1. Create Stripe Payment Link
  const paymentLink = await stripe.paymentLinks.create({
    line_items: [{ price: priceId, quantity: 1 }],
    after_completion: {
      type: 'redirect',
      // {CHECKOUT_SESSION_ID} is required so the dashboard can resolve the
      // buyer's email server-side and gate the profile-setup step.
      redirect: { url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}` },
    },
    metadata: { customer_id: customerId, tier },
  });

  // 2. Update customer status in Supabase
  const { error: updateError } = await supabaseAdmin
    .from('customers')
    .update({ status: 'approved' })
    .eq('id', customerId);

  if (updateError) {
    throw new Error(`Failed to update customer status: ${updateError.message}`);
  }

  // 3. Send approval email
  const firstName = customerName.split(' ')[0];
  const { ok: emailOk } = await sendEmail({
    to:      customerEmail,
    subject: 'Your Saver Miles plan is ready — complete your signup',
    html:    approvalEmail(firstName, tier, paymentLink.url),
  });

  if (!emailOk) {
    console.error('[approveApplication] approval email was not sent');
  }

  // 4. Audit log
  await logAudit({
    action: 'approve_application',
    table: 'customers',
    recordId: customerId,
    detail: { tier, priceId, paymentLinkId: paymentLink.id },
  });

  revalidatePath('/admin/applications');
}

export async function rejectApplication(
  customerId: string,
  customerEmail: string,
  customerName: string,
): Promise<void> {
  // 1. Update customer status
  const { error: updateError } = await supabaseAdmin
    .from('customers')
    .update({ status: 'inactive' })
    .eq('id', customerId);

  if (updateError) {
    throw new Error(`Failed to update customer status: ${updateError.message}`);
  }

  // 2. Send rejection email
  const firstName = customerName.split(' ')[0];
  const { ok: emailOk } = await sendEmail({
    to:      customerEmail,
    subject: 'Your Saver Miles application — an update',
    html:    rejectionEmail(firstName),
  });

  if (!emailOk) {
    console.error('[rejectApplication] rejection email was not sent');
  }

  // 3. Audit log
  await logAudit({ action: 'reject_application', table: 'customers', recordId: customerId });

  revalidatePath('/admin/applications');
}
