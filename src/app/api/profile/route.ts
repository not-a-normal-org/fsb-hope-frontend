import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { email, fullName, phone, companyName, businessType } = body;

  if (!email) {
    return NextResponse.json({ error: 'email is required' }, { status: 400 });
  }

  // Fetch current status so we only promote pending → active, not demote anything else
  const { data: existing } = await supabaseAdmin
    .from('customers')
    .select('status')
    .eq('email', email)
    .maybeSingle();

  const { error } = await supabaseAdmin
    .from('customers')
    .update({
      ...(fullName     ? { full_name:     fullName }     : {}),
      ...(phone        ? { phone }                       : {}),
      ...(companyName  ? { company_name:  companyName }  : {}),
      ...(businessType ? { business_type: businessType } : {}),
      ...(existing?.status === 'pending' ? { status: 'active' } : {}),
    })
    .eq('email', email);

  if (error) {
    console.error('[api/profile] update error:', error.message);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
