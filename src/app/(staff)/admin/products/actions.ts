'use server';

import { revalidatePath } from 'next/cache';

import { supabaseAdmin } from '@/lib/supabase/admin';

// ── Shared ────────────────────────────────────────────────────────────────────

function parseFeatures(raw: string): string[] {
  return raw
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean);
}

// ── Actions ───────────────────────────────────────────────────────────────────

export async function createProduct(formData: FormData): Promise<void> {
  const type             = formData.get('type') as 'subscription' | 'one_off';
  const billingInterval  = formData.get('billing_interval') as string;

  const { error } = await supabaseAdmin.from('products').insert({
    name:               (formData.get('name') as string).trim(),
    description:        (formData.get('description') as string)?.trim() || null,
    type,
    price_cents:        parseInt(formData.get('price_cents') as string, 10),
    billing_interval:   type === 'subscription' && billingInterval ? billingInterval : null,
    features:           parseFeatures(formData.get('features') as string),
    stripe_product_id:  (formData.get('stripe_product_id') as string)?.trim() || null,
    stripe_price_id:    (formData.get('stripe_price_id') as string)?.trim() || null,
    sort_order:         parseInt(formData.get('sort_order') as string, 10) || 0,
    is_active:          true,
  });

  if (error) throw new Error(`createProduct: ${error.message}`);
  revalidatePath('/admin/products');
}

export async function updateProduct(id: string, formData: FormData): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .update({
      name:              (formData.get('name') as string).trim(),
      description:       (formData.get('description') as string)?.trim() || null,
      features:          parseFeatures(formData.get('features') as string),
      is_active:         formData.get('is_active') === 'true',
      sort_order:        parseInt(formData.get('sort_order') as string, 10) || 0,
      stripe_product_id: (formData.get('stripe_product_id') as string)?.trim() || null,
      stripe_price_id:   (formData.get('stripe_price_id') as string)?.trim() || null,
    })
    .eq('id', id);

  if (error) throw new Error(`updateProduct: ${error.message}`);
  revalidatePath('/admin/products');
}

export async function toggleProductActive(
  id: string,
  currentActive: boolean,
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ is_active: !currentActive })
    .eq('id', id);

  if (error) throw new Error(`toggleProductActive: ${error.message}`);
  revalidatePath('/admin/products');
}
