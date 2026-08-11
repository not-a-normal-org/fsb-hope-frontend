/**
 * Staff/RBAC seed + password reset (insurance against lockout).
 *
 * Run: `npm run seed:staff`  (→ `payload run src/scripts/seed-staff.ts`).
 * `payload run` loads `.env.local` (DATABASE_URI, PAYLOAD_SECRET) via @next/env.
 *
 * Creates (or, if they exist, resets the password + role/status of) one test
 * account per role so `/admin` RBAC can be exercised end-to-end:
 *   rbactest-admin@example.com      role=admin
 *   rbactest-agent@example.com      role=agent
 *   rbactest-searcher@example.com   role=searcher
 *   rbactest-affiliate@example.com  role=affiliate (referralCode RBACTEST)
 * All with password:  RbacTest123!
 *
 * These are TEST accounts — delete them before launch (Team console or /cms).
 * Real staff are created through /admin/team. To reset a REAL account's password
 * instead, pass RESET_EMAIL + RESET_PASSWORD env vars.
 */
import { getPayload } from 'payload';
import config from '@payload-config';

const PASSWORD = 'RbacTest123!';

type StaffRole = 'admin' | 'agent' | 'searcher' | 'affiliate';

const TEST_USERS: Array<{ email: string; role: StaffRole; name: string; referralCode?: string }> = [
  { email: 'rbactest-admin@example.com', role: 'admin', name: 'RBAC Test Admin' },
  { email: 'rbactest-agent@example.com', role: 'agent', name: 'RBAC Test Agent' },
  { email: 'rbactest-searcher@example.com', role: 'searcher', name: 'RBAC Test Searcher' },
  {
    email: 'rbactest-affiliate@example.com',
    role: 'affiliate',
    name: 'RBAC Test Affiliate',
    referralCode: 'RBACTEST',
  },
];

async function upsertUser(
  payload: Awaited<ReturnType<typeof getPayload>>,
  u: { email: string; role: StaffRole; name: string; referralCode?: string; password: string },
) {
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: u.email } },
    limit: 1,
    depth: 0,
  });
  const data = {
    name: u.name,
    role: u.role,
    status: 'active' as const,
    password: u.password,
    ...(u.referralCode ? { referralCode: u.referralCode } : {}),
  };
  if (existing.docs[0]) {
    await payload.update({ collection: 'users', id: existing.docs[0].id, data });
    console.log(`✓ reset ${u.email} (${u.role})`);
  } else {
    await payload.create({ collection: 'users', data: { email: u.email, ...data } });
    console.log(`✓ created ${u.email} (${u.role})`);
  }
}

async function main() {
  const payload = await getPayload({ config });

  for (const u of TEST_USERS) {
    await upsertUser(payload, { ...u, password: PASSWORD });
  }

  // Optional: reset a real account's password (RESET_EMAIL + RESET_PASSWORD).
  const resetEmail = process.env.RESET_EMAIL;
  const resetPassword = process.env.RESET_PASSWORD;
  if (resetEmail && resetPassword) {
    const found = await payload.find({
      collection: 'users',
      where: { email: { equals: resetEmail } },
      limit: 1,
      depth: 0,
    });
    if (found.docs[0]) {
      await payload.update({ collection: 'users', id: found.docs[0].id, data: { password: resetPassword } });
      console.log(`✓ password reset for ${resetEmail}`);
    } else {
      console.log(`• ${resetEmail} not found — no reset`);
    }
  }

  console.log(`\nStaff seed complete. Test password: ${PASSWORD}`);
  await flush();
}

const flush = () =>
  new Promise<void>((resolve) => {
    let pending = 2;
    const done = () => --pending === 0 && resolve();
    process.stdout.write('', done);
    process.stderr.write('', done);
  });

try {
  await main();
  await flush();
  process.exit(0);
} catch (err) {
  console.error('Staff seed failed:', err);
  await flush();
  process.exit(1);
}
