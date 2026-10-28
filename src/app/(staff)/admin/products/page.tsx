import { supabaseAdmin } from '@/lib/supabase/admin';
import { ProductsClient, type Product } from './ProductsClient';

export default async function ProductsPage() {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(
      'id, name, description, type, price_cents, billing_interval, features, is_active, sort_order, stripe_product_id, stripe_price_id',
    )
    .order('sort_order', { ascending: true });

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
        Failed to load products: {error.message}
      </div>
    );
  }

  return <ProductsClient products={(data ?? []) as Product[]} />;
}
