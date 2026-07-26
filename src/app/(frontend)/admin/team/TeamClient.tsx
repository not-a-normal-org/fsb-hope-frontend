'use client';

import { useState, useTransition } from 'react';

import {
  createUser,
  updateUser,
  setStatus,
  resetPassword,
  type ActionResult,
  type Role,
  type Status,
} from './actions';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TeamUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  company: string | null;
  referralCode: string | null;
  notes: string | null;
  createdAt: string;
}

// ── Shared field styles (match the rest of the admin) ──────────────────────────

const INPUT =
  'w-full px-3 py-2 rounded-lg text-sm text-[#F5F5F0] bg-[#07090F] border border-[#1E2538] placeholder:text-[#5C6378] focus:outline-none focus:border-[#E8963A] focus:ring-1 focus:ring-[#E8963A]/30 transition-colors';
const LABEL = 'block text-xs font-medium text-[#9DA3B4] mb-1.5';
const BTN_PRIMARY =
  'px-4 py-2 rounded-xl text-sm font-semibold bg-[#E8963A] text-[#07090F] hover:bg-[#F2AA5E] disabled:opacity-55 disabled:cursor-not-allowed transition-colors';
const BTN_GHOST =
  'px-4 py-2 rounded-xl text-sm font-medium text-[#9DA3B4] border border-[#1E2538] hover:text-[#F5F5F0] disabled:opacity-55 disabled:cursor-not-allowed transition-colors';

const ROLE_OPTIONS: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'agent', label: 'Agent' },
  { value: 'searcher', label: 'Searcher' },
  { value: 'affiliate', label: 'Affiliate' },
];

const ROLE_STYLES: Record<Role, string> = {
  admin: 'bg-[#E8963A]/10 text-[#E8963A] border border-[#E8963A]/25',
  agent: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  searcher: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
  affiliate: 'bg-teal-500/10 text-teal-400 border border-teal-500/20',
};

const STATUS_STYLES: Record<Status, string> = {
  active: 'bg-green-500/10 text-green-400 border border-green-500/20',
  suspended: 'bg-red-500/10 text-red-400 border border-red-500/20',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

/** A readable random password (client-side; Payload hashes it server-side). */
function generatePassword(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const bytes = new Uint32Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (n) => alphabet[n % alphabet.length]).join('');
}

function RoleBadge({ role }: { role: Role }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${ROLE_STYLES[role]}`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

// ── Affiliate-only fields (shared by add + edit forms) ─────────────────────────

function AffiliateFields({
  role,
  company,
  referralCode,
}: {
  role: Role;
  company?: string | null;
  referralCode?: string | null;
}) {
  if (role !== 'affiliate') return null;
  return (
    <>
      <div>
        <label className={LABEL}>Company / practice</label>
        <input name="company" defaultValue={company ?? ''} className={INPUT} />
      </div>
      <div>
        <label className={LABEL}>Referral code</label>
        <input name="referralCode" defaultValue={referralCode ?? ''} className={INPUT} />
      </div>
    </>
  );
}

// ── Add-user form ──────────────────────────────────────────────────────────────

function AddUserForm({ onClose }: { onClose: () => void }) {
  const [role, setRole] = useState<Role>('agent');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  return (
    <div className="bg-[#13182A] border border-[#E8963A]/30 rounded-2xl p-6 mb-6">
      <h3 className="text-sm font-semibold text-[#F5F5F0] mb-5">New Account</h3>

      <form
        action={(formData) => {
          startTransition(async () => {
            const res: ActionResult = await createUser(formData);
            if (res.ok) onClose();
            else setError(res.error);
          });
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Full name *</label>
            <input name="name" required placeholder="Jane Doe" className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Email *</label>
            <input name="email" type="email" required placeholder="jane@example.com" className={INPUT} />
          </div>

          <div>
            <label className={LABEL}>Role *</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className={INPUT}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>Status</label>
            <select name="status" defaultValue="active" className={INPUT}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className={LABEL}>Password * (min 8 chars)</label>
            <div className="flex gap-2">
              <input
                name="password"
                type="text"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set or generate a password"
                className={INPUT}
              />
              <button
                type="button"
                onClick={() => setPassword(generatePassword())}
                className={`${BTN_GHOST} whitespace-nowrap`}
              >
                Generate
              </button>
            </div>
            <p className="mt-1 text-[11px] text-[#5C6378]">
              Copy this now — it is hashed on save and can’t be shown again.
            </p>
          </div>

          <AffiliateFields role={role} />

          <div className="col-span-2">
            <label className={LABEL}>Internal notes</label>
            <textarea name="notes" rows={2} className={INPUT} />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-5 pt-5 border-t border-[#1E2538]">
          <button type="submit" disabled={isPending} className={BTN_PRIMARY}>
            {isPending ? 'Creating…' : 'Create account'}
          </button>
          <button type="button" onClick={onClose} disabled={isPending} className={BTN_GHOST}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Inline edit panel ──────────────────────────────────────────────────────────

function EditPanel({ user, onClose }: { user: TeamUser; onClose: () => void }) {
  const [role, setRole] = useState<Role>(user.role);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  // Reset-password sub-form
  const [newPassword, setNewPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwPending, startPwTransition] = useTransition();

  return (
    <div className="bg-[#07090F] border border-[#1E2538] rounded-xl p-5 space-y-5">
      <form
        action={(formData) => {
          startTransition(async () => {
            const res: ActionResult = await updateUser(user.id, formData);
            if (res.ok) onClose();
            else setError(res.error);
          });
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Full name *</label>
            <input name="name" required defaultValue={user.name} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Email (read-only)</label>
            <input value={user.email} readOnly className={`${INPUT} opacity-60`} />
          </div>
          <div>
            <label className={LABEL}>Role *</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className={INPUT}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LABEL}>Status *</label>
            <select name="status" defaultValue={user.status} className={INPUT}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <AffiliateFields role={role} company={user.company} referralCode={user.referralCode} />

          <div className="col-span-2">
            <label className={LABEL}>Internal notes</label>
            <textarea name="notes" rows={2} defaultValue={user.notes ?? ''} className={INPUT} />
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-3 mt-5">
          <button type="submit" disabled={isPending} className={BTN_PRIMARY}>
            {isPending ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={onClose} disabled={isPending} className={BTN_GHOST}>
            Cancel
          </button>
        </div>
      </form>

      {/* Reset password */}
      <div className="border-t border-[#1E2538] pt-4">
        <label className={LABEL}>Reset password</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password (min 8 chars)"
            className={INPUT}
          />
          <button
            type="button"
            onClick={() => setNewPassword(generatePassword())}
            className={`${BTN_GHOST} whitespace-nowrap`}
          >
            Generate
          </button>
          <button
            type="button"
            disabled={pwPending || newPassword.length < 8}
            onClick={() =>
              startPwTransition(async () => {
                const res = await resetPassword(user.id, newPassword);
                if (res.ok) {
                  setNewPassword('');
                  setPwMsg('Password updated. Copy it now — it can’t be shown again.');
                } else {
                  setPwMsg(res.error);
                }
              })
            }
            className={`${BTN_PRIMARY} whitespace-nowrap`}
          >
            {pwPending ? 'Setting…' : 'Set'}
          </button>
        </div>
        {pwMsg && <p className="mt-2 text-xs text-[#9DA3B4]">{pwMsg}</p>}
      </div>
    </div>
  );
}

// ── Row ─────────────────────────────────────────────────────────────────────

function UserRow({
  user,
  isEditing,
  isLast,
  onEdit,
  onCancelEdit,
}: {
  user: TeamUser;
  isEditing: boolean;
  isLast: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const suspended = user.status === 'suspended';

  return (
    <>
      <tr className={`transition-colors hover:bg-[#0E1220] ${!isLast || isEditing ? 'border-b border-[#1E2538]' : ''}`}>
        <td className="px-5 py-3.5">
          <p className="font-medium text-[#F5F5F0] leading-tight">{user.name}</p>
          <p className="text-xs text-[#9DA3B4] mt-0.5">{user.email}</p>
        </td>
        <td className="px-5 py-3.5"><RoleBadge role={user.role} /></td>
        <td className="px-5 py-3.5"><StatusBadge status={user.status} /></td>
        <td className="px-5 py-3.5 text-[#9DA3B4] tabular-nums whitespace-nowrap text-xs">
          {fmtDate(user.createdAt)}
        </td>
        <td className="px-5 py-3.5">
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={isEditing ? onCancelEdit : onEdit}
              className="text-xs text-[#9DA3B4] hover:text-[#E8963A] border border-[#1E2538] hover:border-[#E8963A]/40 px-3 py-1.5 rounded-lg transition-colors"
            >
              {isEditing ? 'Close' : 'Edit'}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await setStatus(user.id, suspended ? 'active' : 'suspended');
                })
              }
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-55 ${
                suspended
                  ? 'text-green-400 border-green-500/20 hover:border-green-400/40'
                  : 'text-red-400 border-red-500/20 hover:border-red-400/40'
              }`}
            >
              {isPending ? '…' : suspended ? 'Activate' : 'Suspend'}
            </button>
          </div>
        </td>
      </tr>
      {isEditing && (
        <tr>
          <td colSpan={5} className={`px-5 py-4 ${!isLast ? 'border-b border-[#1E2538]' : ''}`}>
            <EditPanel user={user} onClose={onCancelEdit} />
          </td>
        </tr>
      )}
    </>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export function TeamClient({ users }: { users: TeamUser[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#9DA3B4]">
          {users.length} account{users.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => {
            setShowAdd((v) => !v);
            setEditingId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#E8963A] text-[#07090F] hover:bg-[#F2AA5E] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Account
        </button>
      </div>

      {showAdd && <AddUserForm onClose={() => setShowAdd(false)} />}

      <div className="bg-[#13182A] border border-[#1E2538] rounded-2xl overflow-hidden">
        {users.length === 0 ? (
          <p className="text-center text-sm text-[#5C6378] py-16">No accounts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E2538]">
                  {['Account', 'Role', 'Status', 'Created', ''].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-widest text-[#5C6378] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    isEditing={editingId === u.id}
                    isLast={i === users.length - 1}
                    onEdit={() => {
                      setEditingId(u.id);
                      setShowAdd(false);
                    }}
                    onCancelEdit={() => setEditingId(null)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
