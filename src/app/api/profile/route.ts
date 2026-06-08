import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { sessionId, fullName, phone, companyName, businessType } = body;

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  // Derive the target email from the Stripe session — never from the request
  // body — so a caller can only update the profile tied to their own checkout.
  let email: string | null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    email = session.customer_details?.email ?? null;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/profile] session retrieve failed:', message);
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: 'Session has no associated email' }, { status: 400 });
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
