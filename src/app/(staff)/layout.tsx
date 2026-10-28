import type { Metadata } from 'next';

import DocumentShell, { siteMetadata } from '@/components/system/DocumentShell';

/**
 * Root layout for the staff and partner surfaces — /admin, /login, /portal, and
 * the /maintenance notice. They aren't localized, so they sit outside the public
 * `[lang]` tree and always render in English. Moving between here and a public
 * page is a full page load (different root layouts), which these flows already
 * tolerate: they are entered by redirect or a fresh visit.
 */
export const metadata: Metadata = siteMetadata('en');

export default function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DocumentShell locale="en">{children}</DocumentShell>;
}
