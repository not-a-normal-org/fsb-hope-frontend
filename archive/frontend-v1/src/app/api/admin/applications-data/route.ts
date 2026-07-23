import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('id, full_name, email, phone, company_name, business_type, annual_spend_range, tags, status, created_at')
    .in('status', ['pending', 'active', 'approved'])
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ customers: data ?? [] });
}
