import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getCurrentUser } from '@/lib/auth';
import { hasRole } from '@/lib/access';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  // Used by the Applications review flow (admin/agent) to list product options.
  const user = await getCurrentUser();
  if (!hasRole(user, ['admin', 'agent'])) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('id, name, stripe_price_id, price_cents, billing_interval, type')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data ?? [] });
}
