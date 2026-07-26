'use client';

import { useTransition } from 'react';

import { CUSTOMER_TIERS, type CustomerTierKey } from '@/lib/tiers';
import { setCustomerTier } from './actions';

/**
 * Inline tier picker for a customer row. Changing the value saves immediately via
 * the server action (optimistic-free, kept simple) and revalidates the page.
 */
export function TierSelect({
  customerId,
  current,
}: {
  customerId: string;
  current: CustomerTierKey | null;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      aria-label="Membership tier"
      value={current ?? ''}
      disabled={isPending}
      onChange={(e) =>
        startTransition(async () => {
          await setCustomerTier(customerId, e.target.value);
        })
      }
      className="rounded-lg bg-[#07090F] border border-[#1E2538] px-2.5 py-1.5 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#E8963A] focus:ring-1 focus:ring-[#E8963A]/30 disabled:opacity-50 transition-colors"
    >
      <option value="">— none —</option>
      {CUSTOMER_TIERS.map((t) => (
        <option key={t.key} value={t.key}>
          {t.label}
        </option>
      ))}
    </select>
  );
}
