'use client';

import { useTransition } from 'react';

import { assignLead, setLeadStatus } from './actions';
import { LEAD_STATUSES } from '@/lib/leads';

export interface Account {
  id: number;
  name: string;
  role: string;
}

const SELECT =
  'rounded-lg bg-[#07090F] border border-[#1E2538] px-2.5 py-1.5 text-xs text-[#F5F5F0] focus:outline-none focus:border-[#E8963A] focus:ring-1 focus:ring-[#E8963A]/30 disabled:opacity-50 transition-colors';

export function AssigneeSelect({
  leadId,
  current,
  accounts,
}: {
  leadId: string;
  current: number | null;
  accounts: Account[];
}) {
  const [pending, start] = useTransition();
  return (
    <select
      aria-label="Assign lead"
      className={SELECT}
      disabled={pending}
      value={current ?? ''}
      onChange={(e) => {
        const v = e.target.value;
        start(async () => {
          await assignLead(leadId, v ? Number(v) : null);
        });
      }}
    >
      <option value="">Unassigned</option>
      {accounts.map((a) => (
        <option key={a.id} value={a.id}>
          {(a.name || 'Unnamed') + ' · ' + a.role}
        </option>
      ))}
    </select>
  );
}

export function StatusSelect({ leadId, current }: { leadId: string; current: string }) {
  const [pending, start] = useTransition();
  return (
    <select
      aria-label="Lead status"
      className={SELECT}
      disabled={pending}
      value={current}
      onChange={(e) => {
        const v = e.target.value;
        start(async () => {
          await setLeadStatus(leadId, v);
        });
      }}
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
