import type { Metadata } from 'next';
import PreferencesForm from './PreferencesForm';

export const metadata: Metadata = {
  title: 'Set Up Your Seat Alerts — The Flights Club by iFLYflat',
  description: 'Tell us which routes and dates to monitor for Business Class award seats.',
};

export default async function AlertsPreferencesPage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session } = await searchParams;
  return <PreferencesForm reference={session ?? ''} />;
}
