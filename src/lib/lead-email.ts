import { SITE_URL } from '@/lib/constants';
import type { LeadViewSection } from '@/lib/leads';

/**
 * Email-safe HTML (tables + inline styles, literal colors — email clients ignore
 * CSS variables) for the new-lead notification sent to the team inbox. Separate
 * from the API route so it can be rendered and checked without submitting a lead.
 */

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');
}

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif";

export function leadEmailHtml(type: string, heading: string, sections: LeadViewSection[]): string {
  const body = sections
    .map(
      (section) => `
      <tr><td style="padding:22px 0 6px;font:600 11px/1.4 ${FONT};letter-spacing:.12em;text-transform:uppercase;color:#C9791B;">${esc(section.title)}</td></tr>
      <tr><td>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
          ${section.rows
            .map(
              (row) => `<tr>
            <td valign="top" style="padding:6px 16px 6px 0;width:150px;font:13px/1.5 ${FONT};color:#6B7280;">${esc(row.label)}</td>
            <td valign="top" style="padding:6px 0;font:14px/1.5 ${FONT};color:#111827;">${esc(row.value)}</td>
          </tr>`,
            )
            .join('')}
        </table>
      </td></tr>`,
    )
    .join('');

  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F6F5F2;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border:1px solid #E5E3DE;border-radius:12px;padding:28px 32px;">
        <tr><td style="font:600 11px/1.4 ${FONT};letter-spacing:.12em;text-transform:uppercase;color:#6B7280;">New ${esc(type)} lead</td></tr>
        <tr><td style="padding-top:6px;font:700 20px/1.35 ${FONT};color:#0E1220;">${esc(heading)}</td></tr>
        ${body}
        <tr><td style="padding-top:26px;border-top:1px solid #E5E3DE;font:13px/1.6 ${FONT};color:#6B7280;">
          Reply to this email to reach the customer directly.<br/>
          <a href="${SITE_URL}/admin/leads" style="color:#C9791B;">Open the Leads console</a> to assign it.
        </td></tr>
      </table>
    </td></tr>
  </table>`;
}
