import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const email = req.nextUrl.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'email query param required' }, { status: 400 });
  }

  const { data: customer, error } = await supabaseAdmin
    .from('customers')
    .select('id, full_name, phone, company_name, business_type, annual_spend_range, tags, status, email')
    .eq('email', email)
    .maybeSingle();

  if (error) {
    console.error('[api/profile/lookup] error:', error.message);
    return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
  }

  if (!customer) {
    return NextResponse.json({ exists: false, complete: false, customer: null });
  }

  const complete = !!(customer.full_name && customer.phone && customer.company_name);

  return NextResponse.json({ exists: true, complete, customer });
}
