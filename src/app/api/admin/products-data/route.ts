import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getAuthorizedUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  // Used by the Applications review flow to list product options, so it answers
  // whoever may open that page.
  if (!(await getAuthorizedUser('/admin/applications'))) {
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
