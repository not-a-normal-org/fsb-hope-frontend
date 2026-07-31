'use client';

import { useTransition } from 'react';

import { LEAD_STATUSES } from '@/lib/leads';
import { setMyLeadStatus } from './actions';

/**
 * Status picker for a lead in the assignee's queue. Saves immediately via the
 * ownership-checked portal action.
 */
export function MyLeadStatusSelect({ leadId, current }: { leadId: string; current: string }) {
  const [pending, start] = useTransition();
  return (
    <select
      aria-label="Update status"
      disabled={pending}
      value={current}
      onChange={(e) => {
        const v = e.target.value;
        start(async () => {
          await setMyLeadStatus(leadId, v);
        });
      }}
      className="rounded-lg px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-55 transition"
      style={{ background: 'var(--sm-glass-bg)', border: '1px solid var(--sm-glass-border)' }}
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
