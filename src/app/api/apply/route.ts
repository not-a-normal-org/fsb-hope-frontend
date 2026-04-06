import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const {
    fullName, email, phone, hearAboutUs,
    companyName, businessType, annualSpend, abn,
    goals, selectedTier,
  } = body as Record<string, string>;

  // Basic server-side validation
  if (!fullName || !email || !phone || !companyName || !businessType || !annualSpend || !selectedTier) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('applications')
    .insert({
      full_name:     fullName,
      email,
      phone,
      hear_about_us: hearAboutUs,
      company_name:  companyName,
      business_type: businessType,
      annual_spend:  annualSpend,
      abn:           abn || null,
      goals:         goals || null,
      tier:          selectedTier,
      status:        'pending',
    });

  if (error) {
    console.error('[api/apply] Supabase insert error:', error.message);
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
