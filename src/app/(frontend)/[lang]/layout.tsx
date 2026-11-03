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
 * Clarity (heatmaps + session replay) is mounted here rather than in
 * DocumentShell, which the staff layout shares: replay must never run over
 * /admin or /cms, where lead and customer records are on screen. It loads
 * nothing until the visitor accepts analytics.
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
    <DocumentShell locale={await resolveLocale(params)}>
      {children}
      <ClarityScript />
    </DocumentShell>
  );
}
