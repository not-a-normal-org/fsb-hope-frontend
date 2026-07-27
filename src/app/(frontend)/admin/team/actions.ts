'use server';

import { revalidatePath } from 'next/cache';

import { getPayloadClient } from '@/lib/payload';

/**
 * Server actions for the Team console — CRUD over the Payload `users` collection
 * (roles: admin/agent/searcher/affiliate). These run through Payload's local API
 * with access override on, so they are NOT constrained by the collection's access
 * rules; they are privileged and reachable only behind the shared-secret admin
 * wall in `src/proxy.ts`. Passwords are hashed by Payload on create/update.
 */

export type Role = 'admin' | 'agent' | 'searcher' | 'affiliate';
export type Status = 'active' | 'suspended';

const ROLES: readonly Role[] = ['admin', 'agent', 'searcher', 'affiliate'];
const STATUSES: readonly Status[] = ['active', 'suspended'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export type ActionResult = { ok: true } | { ok: false; error: string };

function field(fd: FormData, key: string): string {
  return String(fd.get(key) ?? '').trim();
}

/** Map Payload/DB errors to a friendly message without leaking internals. */
function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/duplicate|unique|already/i.test(msg) && /email/i.test(msg)) {
    return 'That email is already in use.';
  }
  if (/duplicate|unique/i.test(msg)) return 'That email is already in use.';
  return msg || 'Something went wrong.';
}

export async function createUser(formData: FormData): Promise<ActionResult> {
  const name = field(formData, 'name');
  const email = field(formData, 'email').toLowerCase();
  const password = String(formData.get('password') ?? '');
  const role = field(formData, 'role') as Role;
  const status = (field(formData, 'status') || 'active') as Status;

  if (!name) return { ok: false, error: 'Name is required.' };
  if (!EMAIL_RE.test(email)) return { ok: false, error: 'A valid email is required.' };
  if (password.length < MIN_PASSWORD)
    return { ok: false, error: `Password must be at least ${MIN_PASSWORD} characters.` };
  if (!ROLES.includes(role)) return { ok: false, error: 'Pick a valid role.' };
  if (!STATUSES.includes(status)) return { ok: false, error: 'Pick a valid status.' };

  const payload = await getPayloadClient();
  try {
    await payload.create({
      collection: 'users',
      data: {
        name,
        email,
        password,
        role,
        status,
        company: role === 'affiliate' ? field(formData, 'company') || undefined : undefined,
        referralCode:
          role === 'affiliate' ? field(formData, 'referralCode') || undefined : undefined,
        notes: field(formData, 'notes') || undefined,
      },
    });
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }

  revalidatePath('/admin/team');
  return { ok: true };
}

export async function updateUser(id: number, formData: FormData): Promise<ActionResult> {
  const name = field(formData, 'name');
  const role = field(formData, 'role') as Role;
  const status = field(formData, 'status') as Status;

  if (!name) return { ok: false, error: 'Name is required.' };
  if (!ROLES.includes(role)) return { ok: false, error: 'Pick a valid role.' };
  if (!STATUSES.includes(status)) return { ok: false, error: 'Pick a valid status.' };

  const payload = await getPayloadClient();
  try {
    await payload.update({
      collection: 'users',
      id,
      data: {
        name,
        role,
        status,
        company: role === 'affiliate' ? field(formData, 'company') || null : null,
        referralCode: role === 'affiliate' ? field(formData, 'referralCode') || null : null,
        notes: field(formData, 'notes') || null,
      },
    });
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }

  revalidatePath('/admin/team');
  return { ok: true };
}

export async function setStatus(id: number, status: Status): Promise<ActionResult> {
  if (!STATUSES.includes(status)) return { ok: false, error: 'Invalid status.' };
  const payload = await getPayloadClient();
  try {
    await payload.update({ collection: 'users', id, data: { status } });
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
  revalidatePath('/admin/team');
  return { ok: true };
}

export async function resetPassword(id: number, password: string): Promise<ActionResult> {
  if (password.length < MIN_PASSWORD)
    return { ok: false, error: `Password must be at least ${MIN_PASSWORD} characters.` };
  const payload = await getPayloadClient();
  try {
    await payload.update({ collection: 'users', id, data: { password } });
  } catch (e) {
    return { ok: false, error: friendlyError(e) };
  }
  revalidatePath('/admin/team');
  return { ok: true };
}
