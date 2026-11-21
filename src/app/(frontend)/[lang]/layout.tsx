import type { Metadata } from 'next';

import ClarityScript from '@/components/system/ClarityScript';
import DocumentShell, { siteMetadata } from '@/components/system/DocumentShell';
import { LOCALES } from '@/i18n/config';
import { resolveLocale, type LangParams } from '@/i18n/get-messages';

/**
 * Root layout of the public site, one per language. English is served from the
 * unprefixed URLs (src/proxy.ts rewrites `/pricing` → `/en/pricing`) and German
 * from `/de/...`; both prerender here, so a static page stays static in each
 * language. Staff routes have their own root layout in `app/(staff)`.
 *
 * `tracking` turns on the Google tag (GA4 + Google Ads) and the cookie banner for
 * the public site only. Clarity (heatmaps + session replay) is mounted here
 * rather than in DocumentShell for the same reason: the staff layout shares that
 * shell, and no tag may run over /admin or /cms, where lead and customer records
 * are on screen. Clarity loads nothing until the visitor accepts.
 */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  return siteMetadata(await resolveLocale(params));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LangParams;
}>) {
  return (
    <DocumentShell locale={await resolveLocale(params)} tracking>
      {children}
      <ClarityScript />
    </DocumentShell>
  );
}
