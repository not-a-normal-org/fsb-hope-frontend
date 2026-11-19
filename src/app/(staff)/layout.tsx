import type { Metadata } from 'next';

import DocumentShell, { siteMetadata } from '@/components/system/DocumentShell';

/**
 * Root layout for the staff and partner surfaces — /admin, /login, /portal, and
 * the /maintenance notice. They aren't localized, so they sit outside the public
 * `[lang]` tree and always render in English. Moving between here and a public
 * page is a full page load (different root layouts), which these flows already
 * tolerate: they are entered by redirect or a fresh visit.
 */
export const metadata: Metadata = {
  ...siteMetadata('en'),
  // Nothing in this group is meant for search, and without its own description
  // every page here inherited the public tagline: crawlers saw one short,
  // identical description on /login, /maintenance and /admin/login. Each page
  // that anonymous visitors can reach now sets its own.
  description:
    'Saver Miles workspace for team members and partners to manage assigned flight searches and referrals. Signing in with an active account is required.',
  robots: { index: false, follow: false },
};

export default function StaffLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DocumentShell locale="en">{children}</DocumentShell>;
}
