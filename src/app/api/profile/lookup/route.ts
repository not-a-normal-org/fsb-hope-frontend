import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'session_id query param required' }, { status: 400 });
  }

  // Derive the email from the Stripe checkout session rather than trusting a
  // client-supplied address. This gates the lookup behind possession of a real
  // checkout session id, preventing anyone from reading arbitrary profiles.
  let email: string | null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    email = session.customer_details?.email ?? null;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[api/profile/lookup] session retrieve failed:', message);
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ exists: false, complete: false, customer: null, email: null });
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
    return NextResponse.json({ exists: false, complete: false, customer: null, email });
  }

  const complete = !!(customer.full_name && customer.phone && customer.company_name);

  return NextResponse.json({ exists: true, complete, customer, email });
}
