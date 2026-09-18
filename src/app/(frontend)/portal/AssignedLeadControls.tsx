'use client';

import { useTransition } from 'react';

import { LEAD_STATUSES, type LeadViewSection } from '@/lib/leads';
import LeadDetailsButton, { type LeadDialogSkin } from '@/components/leads/LeadDetailsButton';
import { setMyLeadStatus } from './actions';

/** Portal look: theme tokens, so the dialog follows Dark / Light / Mono. */
const PORTAL_SKIN: LeadDialogSkin = {
  trigger:
    'sm-icon-btn inline-flex h-8 w-8 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
  panel: 'bg-bg-elevated text-ink border border-[color:var(--sm-glass-border)] backdrop:bg-black/60',
  meta: 'text-ink-sub',
  sectionTitle: 'text-accent',
  label: 'text-ink-muted',
  value: 'text-ink',
  divider: 'border-[color:var(--sm-glass-border)]',
  close: 'sm-icon-btn',
};

/** Read-only view of everything the customer submitted for an assigned lead. */
export function MyLeadViewButton(props: { heading: string; meta?: string; sections: LeadViewSection[] }) {
  return <LeadDetailsButton {...props} skin={PORTAL_SKIN} />;
}

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
