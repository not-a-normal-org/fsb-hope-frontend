'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';

import { localizePath } from '@/i18n/config';
import { useLocale } from '@/i18n/LocaleProvider';

/**
 * Drop-in for `next/link` on public pages: write the English path
 * (`href="/pricing"`) and it resolves to the current language's URL (`/de/pricing`
 * on a German page). External links, `#hash`, `mailto:`, and unlocalized paths
 * (`/api`, `/admin`, assets) pass through unchanged — see `localizePath`.
 */
export default function LocaleLink({ href, ...rest }: ComponentProps<typeof Link>) {
  const locale = useLocale();
  const localized =
    typeof href === 'string'
      ? localizePath(locale, href)
      : href.pathname
        ? { ...href, pathname: localizePath(locale, href.pathname) }
        : href;
  return <Link href={localized} {...rest} />;
}
