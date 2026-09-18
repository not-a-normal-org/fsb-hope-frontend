'use client';

import { useState, useTransition } from 'react';
import { Pencil } from 'lucide-react';

import { assignLead, setLeadStatus, updateLead } from './actions';
import { LEAD_DETAIL_FIELDS, LEAD_STATUSES, type LeadOption, type LeadViewSection } from '@/lib/leads';
import LeadDetailsButton, { type LeadDialogSkin } from '@/components/leads/LeadDetailsButton';

export interface Account {
  id: number;
  name: string;
  role: string;
}

export interface LeadEditData {
  id: string;
  type: string | null;
  email: string | null;
  whatsapp: string | null;
  phone: string | null;
  route: string | null;
  flight_need: string | null;
  points_held: string | null;
  yearly_spend: string | null;
  points_budget: string | null;
  /** Stored questionnaire answers (leads.details), stringified. */
  details: Record<string, string>;
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

// ── View ────────────────────────────────────────────────────────────────────

const ICON_BTN =
  'inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E2538] bg-[#07090F] text-[#9DA3B4] hover:border-[#E8963A] hover:text-[#F5F5F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8963A]/60 transition-colors';

const ADMIN_SKIN: LeadDialogSkin = {
  trigger: ICON_BTN,
  panel: 'bg-[#0E1220] border border-[#1E2538] text-[#F5F5F0] backdrop:bg-[rgba(3,6,12,0.7)]',
  meta: 'text-[#9DA3B4]',
  sectionTitle: 'text-[#E8963A]',
  label: 'text-[#5C6378]',
  value: 'text-[#F5F5F0]',
  divider: 'border-[#1E2538]',
  close: 'border border-[#1E2538] bg-[#07090F] text-[#9DA3B4] hover:border-[#E8963A] hover:text-[#F5F5F0] transition-colors',
};

/** Read-only view of everything a lead submitted (eye icon). */
export function LeadViewButton(props: { heading: string; meta?: string; sections: LeadViewSection[] }) {
  return <LeadDetailsButton {...props} skin={ADMIN_SKIN} />;
}

// ── Edit ────────────────────────────────────────────────────────────────────

type TopKey = Exclude<keyof LeadEditData, 'id' | 'type' | 'details'>;

/** Which lead type a field belongs to. Off-type fields still show if they hold a value. */
const TOP_FIELDS: { key: TopKey; label: string; type?: string; area?: boolean; for?: 'individual' | 'business' }[] = [
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'whatsapp', label: 'WhatsApp', type: 'tel' },
  { key: 'phone', label: 'Phone', type: 'tel' },
  { key: 'route', label: 'Route / destination', for: 'individual' },
  { key: 'points_held', label: 'Points held', for: 'individual' },
  { key: 'flight_need', label: 'Routes & cabins', area: true, for: 'business' },
  { key: 'yearly_spend', label: 'Annual flight spend', for: 'business' },
  { key: 'points_budget', label: 'Points / budget', for: 'business' },
];

const INPUT =
  'w-full rounded-lg bg-[#07090F] border border-[#1E2538] px-3 py-2 text-sm text-[#F5F5F0] placeholder:text-[#5C6378] focus:outline-none focus:border-[#E8963A] focus:ring-1 focus:ring-[#E8963A]/30 transition-colors';

/** Options for a select, keeping an older/free-text stored value selectable so saving never wipes it. */
function optionsWithCurrent(options: LeadOption[], current: string): LeadOption[] {
  return current && !options.some((o) => o.value === current)
    ? [...options, { value: current, label: current }]
    : options;
}

export function LeadEditButton({ lead }: { lead: LeadEditData }) {
  const [open, setOpen] = useState(false);
  const [top, setTop] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [pending, start] = useTransition();

  const business = lead.type === 'business';
  const topFields = TOP_FIELDS.filter(
    (f) => !f.for || f.for === (business ? 'business' : 'individual') || lead[f.key],
  );
  // Trip questions are the individual questionnaire; notes apply to every lead.
  const detailFields = LEAD_DETAIL_FIELDS.filter(
    (f) => !business || f.section === 'notes' || lead.details[f.key],
  ).filter((f) => f.key !== 'preferences' || lead.details.preferences);

  function launch() {
    setTop(Object.fromEntries(TOP_FIELDS.map((f) => [f.key, lead[f.key] ?? ''])));
    setAnswers(Object.fromEntries(LEAD_DETAIL_FIELDS.map((f) => [f.key, lead.details[f.key] ?? ''])));
    setError('');
    setOpen(true);
  }

  function save() {
    setError('');
    start(async () => {
      const res = await updateLead(lead.id, { ...top, details: answers });
      if (res.ok) setOpen(false);
      else setError(res.error);
    });
  }

  const label = (text: string) => (
    <span className="mb-1 block text-[11px] uppercase tracking-wider text-[#5C6378]">{text}</span>
  );

  return (
    <>
      <button
        type="button"
        onClick={launch}
        aria-label={`Edit lead ${lead.email ?? ''}`.trim()}
        title="Edit"
        className={ICON_BTN}
      >
        <Pencil className="h-4 w-4" aria-hidden />
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
              {topFields.map((f) => (
                <label key={f.key} className="block">
                  {label(f.label)}
                  {f.area ? (
                    <textarea
                      rows={2}
                      value={top[f.key] ?? ''}
                      onChange={(e) => setTop((s) => ({ ...s, [f.key]: e.target.value }))}
                      className={`${INPUT} resize-none`}
                    />
                  ) : (
                    <input
                      type={f.type ?? 'text'}
                      value={top[f.key] ?? ''}
                      onChange={(e) => setTop((s) => ({ ...s, [f.key]: e.target.value }))}
                      className={INPUT}
                    />
                  )}
                </label>
              ))}

              {detailFields.map((f) => {
                const value = answers[f.key] ?? '';
                const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
                  setAnswers((s) => ({ ...s, [f.key]: e.target.value }));
                return (
                  <label key={f.key} className="block">
                    {label(f.label)}
                    {f.options ? (
                      <select value={value} onChange={onChange} className={INPUT}>
                        <option value="">—</option>
                        {optionsWithCurrent(f.options, value).map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.display ?? o.label}
                          </option>
                        ))}
                      </select>
                    ) : f.area ? (
                      <textarea rows={3} value={value} onChange={onChange} className={`${INPUT} resize-none`} />
                    ) : (
                      <input type="text" value={value} onChange={onChange} className={INPUT} />
                    )}
                  </label>
                );
              })}
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
