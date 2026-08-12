'use client';

import { useState, useTransition } from 'react';

import { assignLead, setLeadStatus, updateLead } from './actions';
import { LEAD_STATUSES } from '@/lib/leads';

export interface Account {
  id: number;
  name: string;
  role: string;
}

export interface LeadEditData {
  id: string;
  email: string | null;
  whatsapp: string | null;
  phone: string | null;
  route: string | null;
  flight_need: string | null;
  points_held: string | null;
  yearly_spend: string | null;
  points_budget: string | null;
  notes: string | null;
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

// ── Edit ────────────────────────────────────────────────────────────────────

const FIELDS: { key: keyof Omit<LeadEditData, 'id'>; label: string; type?: string; area?: boolean }[] = [
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'whatsapp', label: 'WhatsApp', type: 'tel' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'route', label: 'Route / destination' },
  { key: 'flight_need', label: 'Flight need', area: true },
  { key: 'points_held', label: 'Points held' },
  { key: 'yearly_spend', label: 'Yearly spend' },
  { key: 'points_budget', label: 'Points / budget' },
  { key: 'notes', label: 'Notes', area: true },
];

const INPUT =
  'w-full rounded-lg bg-[#07090F] border border-[#1E2538] px-3 py-2 text-sm text-[#F5F5F0] placeholder:text-[#5C6378] focus:outline-none focus:border-[#E8963A] focus:ring-1 focus:ring-[#E8963A]/30 transition-colors';

export function LeadEditButton({ lead }: { lead: LeadEditData }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [pending, start] = useTransition();

  function launch() {
    setForm(
      Object.fromEntries(FIELDS.map((f) => [f.key, lead[f.key] ?? ''])) as Record<string, string>,
    );
    setError('');
    setOpen(true);
  }

  function save() {
    setError('');
    start(async () => {
      const res = await updateLead(lead.id, form);
      if (res.ok) setOpen(false);
      else setError(res.error);
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={launch}
        className="rounded-lg border border-[#1E2538] bg-[#07090F] px-2.5 py-1.5 text-xs text-[#9DA3B4] hover:border-[#E8963A] hover:text-[#F5F5F0] transition-colors"
      >
        Edit
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(3,6,12,0.7)' }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !pending) setOpen(false);
          }}
        >
          <div className="w-full max-w-md max-h-[88vh] overflow-y-auto rounded-2xl bg-[#0E1220] border border-[#1E2538] p-6">
            <h2 className="text-sm font-semibold text-[#F5F5F0] mb-4">Edit lead</h2>
            <div className="space-y-3">
              {FIELDS.map((f) => (
                <label key={f.key} className="block">
                  <span className="mb-1 block text-[11px] uppercase tracking-wider text-[#5C6378]">
                    {f.label}
                  </span>
                  {f.area ? (
                    <textarea
                      rows={2}
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                      className={`${INPUT} resize-none`}
                    />
                  ) : (
                    <input
                      type={f.type ?? 'text'}
                      value={form[f.key] ?? ''}
                      onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                      className={INPUT}
                    />
                  )}
                </label>
              ))}
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="rounded-lg px-4 py-2 text-sm text-[#9DA3B4] hover:text-[#F5F5F0] disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={save}
                disabled={pending}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-[#07090F] bg-[#E8963A] hover:bg-[#F2AA5E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {pending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
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
