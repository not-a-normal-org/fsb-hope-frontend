import type { Metadata } from 'next';
import IntakeForm from './IntakeForm';

export const metadata: Metadata = {
  title: 'Research Report Intake — PointIQ',
  description:
    'Tell us your points balances and destinations so we can build your Redemption Research Report.',
};

export default async function ResearchIntakePage({
  searchParams,
}: {
  searchParams: Promise<{ session?: string }>;
}) {
  const { session } = await searchParams;
  return <IntakeForm reference={session ?? ''} />;
}
