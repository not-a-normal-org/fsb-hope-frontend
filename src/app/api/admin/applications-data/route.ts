import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { getAuthorizedUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  // Customer PII — the proxy only proves "some active staff"; enforce the role here.
  // Feeds the Applications page, so it answers whoever may open that page.
  if (!(await getAuthorizedUser('/admin/applications'))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

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
