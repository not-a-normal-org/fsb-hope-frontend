'use client';

import PageHero from '@/components/site/PageHero';
import Link from '@/components/system/LocaleLink';
import { useI18n } from '@/i18n/LocaleProvider';

export default function NotFoundBody() {
  const { m } = useI18n();
  return (
    <PageHero eyebrow={m.notFound.eyebrow} title={m.notFound.title} intro={m.notFound.body}>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-colors sm-cta"
      >
        {m.notFound.home}
      </Link>
    </PageHero>
  );
}
