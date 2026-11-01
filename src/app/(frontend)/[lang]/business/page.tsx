import type { Metadata } from 'next';

import NavBar from '@/components/site/NavBar';
import Footer from '@/components/site/Footer';
import PageHero from '@/components/site/PageHero';
import TeamBookingCard from '@/components/site/TeamBookingCard';
import BusinessBody from './BusinessBody';
import { getMessages, resolveLocale, type LangParams } from '@/i18n/get-messages';
import { pageMeta } from '@/lib/seo';

/**
 * /business (docs/plans/02) — the company track. ROI / account-level framing,
 * custom ("let's talk") pricing, and the Human Search Alert cross-sell.
 *
 * The multi-step lead form and Cal.com callback booking are deferred to the
 * backend phase; the primary CTA is an interim mailto until they ship.
 */
export async function generateMetadata({ params }: { params: LangParams }): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { title, description } = getMessages(locale).business;
  return pageMeta(locale, '/business', { title, description });
}

export default async function BusinessPage({ params }: { params: LangParams }) {
  const all = getMessages(await resolveLocale(params));
  const m = all.business;
  return (
    <>
      <NavBar />
      <PageHero {...m.hero} aside={<TeamBookingCard m={all.teamBooking} />} />
      <BusinessBody m={m} />
      <Footer />
    </>
  );
}
