import { SITE_URL, SITE_LEGAL_NAME, SITE_ADDRESS_INLINE } from '@/lib/constants';
import { localizePath, type Locale } from '@/i18n/config';
import { fmt } from '@/i18n/format';
import { getMessages } from '@/i18n/get-messages';

/**
 * The newsletter welcome email, in the subscriber's language. Email-safe HTML
 * (tables + inline styles, literal colors — email clients ignore CSS variables).
 * Separate from /api/newsletter so it can be rendered and checked without
 * signing anyone up. The words live in `emails.welcome` in the dictionaries.
 */

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escape a message and turn its one `<link>…</link>` into an anchor to `href`. */
function withLink(template: string, href: string): string {
  return template
    .split(/(<link>.*?<\/link>)/)
    .map((part) => {
      const link = part.match(/^<link>(.*)<\/link>$/);
      return link
        ? `<a href="${href}" style="color:#E8963A;text-decoration:none;">${esc(link[1])}</a>`
        : esc(part);
    })
    .join('');
}

export function welcomeEmail(locale: Locale, name?: string): { subject: string; html: string } {
  const m = getMessages(locale).emails.welcome;
  const firstName = name?.trim().split(' ')[0];
  const greeting = firstName ? fmt(m.greeting, { name: firstName }) : m.greetingNoName;
  const url = (path: string) => `${SITE_URL}${localizePath(locale, path)}`;

  const items = m.items
    .map(
      (item) => `
                <tr>
                  <td style="padding:8px 0;font-size:15px;color:#F5F5F0;">
                    <span style="color:#E8963A;margin-right:10px;">✦</span>
                    ${esc(item)}
                  </td>
                </tr>`,
    )
    .join('');

  const languageNote = m.languageNote
    ? `
              <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#9DA3B4;">
                ${esc(m.languageNote)}
              </p>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(m.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#07090F;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#07090F;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#0E1220;border-radius:16px;overflow:hidden;border:1px solid #1E2538;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 48px 32px;border-bottom:1px solid #1E2538;">
              <p style="margin:0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#E8963A;font-weight:600;">Saver Miles</p>
              <h1 style="margin:12px 0 0;font-size:28px;font-weight:700;color:#F5F5F0;line-height:1.3;">
                ${esc(greeting)}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 48px;">
              <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#9DA3B4;">
                ${esc(m.intro)}
              </p>
              <p style="margin:0 0 20px;font-size:16px;line-height:1.7;color:#9DA3B4;">
                ${esc(m.listIntro)}
              </p>
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">${items}
              </table>
              <p style="margin:0;font-size:16px;line-height:1.7;color:#9DA3B4;">
                ${withLink(m.headStart, url('/blog'))}
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:0 48px 40px;">
              <a href="${url('/how-it-works')}"
                 style="display:inline-block;background-color:#E8963A;color:#07090F;font-weight:700;font-size:15px;padding:14px 32px;border-radius:100px;text-decoration:none;letter-spacing:0.02em;">
                ${esc(m.cta)}
              </a>${languageNote}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px;border-top:1px solid #1E2538;">
              <p style="margin:0 0 8px;font-size:13px;color:#5C6378;line-height:1.6;">
                ${esc(m.footer)}
              </p>
              <p style="margin:0;font-size:12px;color:#5C6378;line-height:1.6;">
                ${esc(SITE_LEGAL_NAME)} · ${esc(SITE_ADDRESS_INLINE)}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject: m.subject, html };
}
