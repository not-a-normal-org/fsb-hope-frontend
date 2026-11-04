'use client';

import { useRef, useState, useTransition } from 'react';

import { addAllowlistEntry, removeAllowlistEntry, type ActionResult } from './actions';

export type AllowlistRow = {
  id: string;
  cidr: string;
  label: string | null;
  created_by: string | null;
  created_at: string;
};

const INPUT =
  'w-full rounded-lg bg-[#07090F] border border-[#1E2538] px-3 py-2 text-sm text-[#F5F5F0] placeholder:text-[#5C6378] focus:outline-none focus:border-[#E8963A] focus:ring-1 focus:ring-[#E8963A]/30 transition-colors';

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(iso),
  );
}

/** A single address shows without its /32 or /128; a range keeps its prefix. */
function display(cidr: string): string {
  const single = cidr.includes(':') ? '/128' : '/32';
  return cidr.endsWith(single) ? cidr.slice(0, -single.length) : cidr;
}

export function AllowlistClient({
  rows,
  currentIp,
  myEntryId,
}: {
  rows: AllowlistRow[];
  currentIp: string | null;
  myEntryId: string | null;
}) {
  const [error, setError] = useState('');
  const [pending, start] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const cidrRef = useRef<HTMLInputElement>(null);

  const run = (fn: () => Promise<ActionResult>, after?: () => void) => {
    setError('');
    start(async () => {
      const res = await fn();
      if (res.ok) after?.();
      else setError(res.error);
    });
  };

  return (
    <div className="space-y-4">
      <form
        ref={formRef}
        className="bg-[#13182A] border border-[#1E2538] rounded-2xl p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          run(() => addAllowlistEntry(fd), () => formRef.current?.reset());
        }}
      >
        <p className="text-[10px] uppercase tracking-widest text-[#5C6378]">Allow an IP address</p>
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <div className="flex gap-2">
            <input
              ref={cidrRef}
              name="cidr"
              required
              placeholder="203.0.113.5 or 2001:db8:1:2::/64"
              aria-label="IP address or range"
              className={`${INPUT} font-mono`}
              autoComplete="off"
              spellCheck={false}
            />
            {currentIp && (
              <button
                type="button"
                onClick={() => {
                  if (cidrRef.current) {
                    cidrRef.current.value = currentIp.includes(':') ? `${currentIp}/64` : currentIp;
                  }
                }}
                className="shrink-0 rounded-lg border border-[#1E2538] px-3 py-2 text-xs text-[#9DA3B4] transition-colors hover:border-[#E8963A]/40 hover:text-[#F5F5F0]"
              >
                Use my IP
              </button>
            )}
          </div>
          <input
            name="label"
            placeholder="Who or where (e.g. Office, Home)"
            aria-label="Label"
            maxLength={120}
            className={INPUT}
          />
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-[#E8963A] px-4 py-2 text-sm font-semibold text-[#07090F] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {pending ? 'Saving…' : 'Allow'}
          </button>
        </div>
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </form>

      <div className="bg-[#13182A] border border-[#1E2538] rounded-2xl overflow-hidden">
        {rows.length === 0 ? (
          <p className="py-14 text-center text-sm text-[#5C6378]">
            No addresses allowed yet — everyone in the blocked region is blocked.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2538]">
                  {['Address or range', 'Label', 'Added by', 'Added', ''].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#5C6378]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id} className={i < rows.length - 1 ? 'border-b border-[#1E2538]' : ''}>
                    <td className="px-5 py-3.5 font-mono text-[#F5F5F0]">
                      {display(row.cidr)}
                      {row.id === myEntryId && (
                        <span className="ml-2 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 font-sans text-xs text-green-400">
                          You
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-[#9DA3B4]">{row.label ?? '—'}</td>
                    <td className="px-5 py-3.5 text-[#9DA3B4]">{row.created_by ?? '—'}</td>
                    <td className="whitespace-nowrap px-5 py-3.5 text-xs tabular-nums text-[#9DA3B4]">
                      {fmtDate(row.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => run(() => removeAllowlistEntry(row.id))}
                        aria-label={`Remove ${display(row.cidr)}`}
                        className="rounded-lg border border-[#1E2538] px-3 py-1 text-xs text-[#9DA3B4] transition-colors hover:border-red-500/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-55"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
