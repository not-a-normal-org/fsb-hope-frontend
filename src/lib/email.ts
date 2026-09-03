import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';

import { SITE_NAME } from '@/lib/constants';

/**
 * Transactional email, sent through Google Workspace (Gmail SMTP) with an App
 * Password. Chosen over an ESP because the domain already authenticates Google
 * (SPF `include:_spf.google.com` + `google._domainkey` DKIM), so mail passes
 * SPF/DKIM/DMARC with no DNS changes — which matters while the domain's DNS
 * cannot add the subdomain records a service like Resend requires.
 *
 * Config: GMAIL_USER (the sending mailbox, e.g. hello@savermiles.com) and
 * GMAIL_APP_PASSWORD (a Google App Password, not the account password). If either
 * is missing the send is skipped and logged — never thrown — so a form submission
 * still succeeds and its DB write (the source of truth) is unaffected.
 *
 * Gmail sends as the authenticated mailbox, so `from` must be GMAIL_USER (or one
 * of its configured aliases). We build it from GMAIL_USER with a display name;
 * callers pass only to/subject/html (+ optional replyTo), never the address.
 */
const USER = process.env.GMAIL_USER;
const PASS = process.env.GMAIL_APP_PASSWORD;

let transporter: Transporter | null = null;

function getTransport(): Transporter | null {
  if (!USER || !PASS) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: USER, pass: PASS },
    });
  }
  return transporter;
}

export interface SendEmailInput {
  to: string | string[];
  subject: string;
  html: string;
  /** Where replies should go — e.g. the lead's own address. */
  replyTo?: string;
  /** Optional display name for the From header (defaults to the site name). */
  fromName?: string;
}

export interface SendEmailResult {
  ok: boolean;
  /** True when skipped because Gmail credentials are not configured. */
  skipped?: boolean;
}

/**
 * Send one transactional email. Never throws for a delivery/config problem —
 * returns `{ ok: false }` (or `{ skipped: true }`) and logs, so callers can treat
 * email as best-effort after the authoritative DB write.
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const tx = getTransport();
  if (!tx) {
    console.warn('[email] GMAIL_USER/GMAIL_APP_PASSWORD not set — skipping send.');
    return { ok: false, skipped: true };
  }

  const from = `${input.fromName ?? SITE_NAME} <${USER}>`;

  try {
    await tx.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      replyTo: input.replyTo,
    });
    return { ok: true };
  } catch (err) {
    console.error('[email] send failed:', err instanceof Error ? err.message : err);
    return { ok: false };
  }
}
