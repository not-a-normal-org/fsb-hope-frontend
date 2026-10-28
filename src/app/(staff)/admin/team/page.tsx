import Link from 'next/link';
import type { Where } from 'payload';

import { getPayloadClient } from '@/lib/payload';
import { TeamClient, type TeamUser } from './TeamClient';
import type { Role } from './actions';

// Reads the CMS at request time, so it must be dynamic (see src/lib/payload.ts).
export const dynamic = 'force-dynamic';

const ROLE_TABS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Admins', value: 'admin' },
  { label: 'Agents', value: 'agent' },
  { label: 'Searchers', value: 'searcher' },
  { label: 'Affiliates', value: 'affiliate' },
];

async function fetchTeam(roleFilter: string) {
  const payload = await getPayloadClient();

  const where: Where | undefined =
    roleFilter === 'all' ? undefined : { role: { equals: roleFilter } };

  const [result, total] = await Promise.all([
    payload.find({ collection: 'users', where, limit: 500, sort: '-createdAt', depth: 0 }),
    payload.count({ collection: 'users' }),
  ]);

  // Map to a client-safe shape — never pass password hash/salt to the client.
  const users: TeamUser[] = result.docs.map((d) => ({
    id: d.id,
    name: d.name,
    email: d.email,
    role: d.role as Role,
    status: d.status,
    company: d.company ?? null,
    referralCode: d.referralCode ?? null,
    notes: d.notes ?? null,
    createdAt: d.createdAt,
  }));

  return { users, total: total.totalDocs };
}

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role: rawRole } = await searchParams;
  const activeRole = ROLE_TABS.some((t) => t.value === rawRole) ? (rawRole ?? 'all') : 'all';

  let users: TeamUser[];
  let total: number;
  try {
    ({ users, total } = await fetchTeam(activeRole));
  } catch (e) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
        Failed to load accounts: {e instanceof Error ? e.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Total stat */}
      <div className="inline-block bg-[#13182A] border border-[#1E2538] rounded-xl px-6 py-4">
        <p className="text-[10px] uppercase tracking-widest text-[#5C6378] mb-1.5">Total Accounts</p>
        <p className="text-3xl font-bold text-[#F5F5F0] tabular-nums">
          {total.toLocaleString('en-AU')}
        </p>
      </div>

      {/* Role filter tabs */}
      <div className="flex gap-1 bg-[#13182A] border border-[#1E2538] rounded-xl p-1 w-fit">
        {ROLE_TABS.map(({ label, value }) => (
          <Link
            key={value}
            href={value === 'all' ? '/admin/team' : `/admin/team?role=${value}`}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeRole === value
                ? 'bg-[#E8963A] text-[#07090F]'
                : 'text-[#9DA3B4] hover:text-[#F5F5F0]'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <TeamClient users={users} />
    </div>
  );
}
