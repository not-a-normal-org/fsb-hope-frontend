'use client';

import { useState, useTransition } from 'react';
import { createProduct, updateProduct, toggleProductActive } from './actions';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string | null;
  type: 'subscription' | 'one_off';
  price_cents: number;
  billing_interval: 'month' | 'year' | null;
  features: string[];
  is_active: boolean;
  sort_order: number;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtAUD(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

// ── Shared field styles ───────────────────────────────────────────────────────

const INPUT =
  'w-full px-3 py-2 rounded-lg text-sm text-[#F5F5F0] bg-[#07090F] border border-[#1E2538] placeholder:text-[#5C6378] focus:outline-none focus:border-[#E8963A] focus:ring-1 focus:ring-[#E8963A]/30 transition-colors';
const LABEL = 'block text-xs font-medium text-[#9DA3B4] mb-1.5';

// ── Toggle switch ─────────────────────────────────────────────────────────────

function ToggleSwitch({
  id,
  isActive,
  disabled,
  onToggle,
}: {
  id: string;
  isActive: boolean;
  disabled: boolean;
  onToggle: (id: string, current: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isActive}
      disabled={disabled}
      onClick={() => onToggle(id, isActive)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8963A]/40 disabled:opacity-50 ${
        isActive ? 'bg-[#E8963A]' : 'bg-[#1E2538]'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${
          isActive ? 'translate-x-[18px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  );
}

// ── Add product form ──────────────────────────────────────────────────────────

function AddProductForm({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<'subscription' | 'one_off'>('subscription');
  const [isPending, startTransition] = useTransition();

  return (
    <div className="bg-[#13182A] border border-[#E8963A]/30 rounded-2xl p-6 mb-6">
      <h3 className="text-sm font-semibold text-[#F5F5F0] mb-5">New Product</h3>

      <form
        action={async (formData) => {
          startTransition(async () => {
            await createProduct(formData);
            onClose();
          });
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Name */}
          <div className="col-span-2">
            <label className={LABEL}>Product name *</label>
            <input name="name" required placeholder="e.g. Platinum Membership" className={INPUT} />
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className={LABEL}>Description</label>
            <textarea name="description" rows={2} placeholder="Optional short description" className={INPUT} />
          </div>

          {/* Type */}
          <div>
            <label className={LABEL}>Type *</label>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'subscription' | 'one_off')}
              className={INPUT}
            >
              <option value="subscription">Subscription</option>
              <option value="one_off">One-off</option>
            </select>
          </div>

          {/* Billing interval */}
          <div>
            <label className={LABEL}>Billing interval</label>
            <select
              name="billing_interval"
              disabled={type !== 'subscription'}
              className={`${INPUT} disabled:opacity-40`}
            >
              <option value="">— none —</option>
              <option value="month">Monthly</option>
              <option value="year">Yearly</option>
            </select>
          </div>

          {/* Price (cents) */}
          <div>
            <label className={LABEL}>Price (cents) *</label>
            <input
              name="price_cents"
              type="number"
              required
              min={0}
              placeholder="e.g. 450000 = AU$4,500"
              className={INPUT}
            />
          </div>

          {/* Sort order */}
          <div>
            <label className={LABEL}>Sort order</label>
            <input name="sort_order" type="number" defaultValue={0} min={0} className={INPUT} />
          </div>

          {/* Features */}
          <div className="col-span-2">
            <label className={LABEL}>Features (one per line)</label>
            <textarea
              name="features"
              rows={4}
              placeholder={"Guaranteed Business Class flights\nDedicated concierge\nPoints strategy sessions"}
              className={INPUT}
            />
          </div>

          {/* Stripe product ID */}
          <div>
            <label className={LABEL}>Stripe product ID</label>
            <input name="stripe_product_id" placeholder="prod_xxx" className={INPUT} />
          </div>

          {/* Stripe price ID */}
          <div>
            <label className={LABEL}>Stripe price ID</label>
            <input name="stripe_price_id" placeholder="price_xxx" className={INPUT} />
          </div>
        </div>

        <div className="flex gap-3 mt-5 pt-5 border-t border-[#1E2538]">
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#E8963A] text-[#07090F] hover:bg-[#F2AA5E] disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Creating…' : 'Create product'}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 rounded-xl text-sm font-medium text-[#9DA3B4] border border-[#1E2538] hover:text-[#F5F5F0] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Edit form (inline, replaces card content) ─────────────────────────────────

function EditForm({ product, onClose }: { product: Product; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={async (formData) => {
        startTransition(async () => {
          await updateProduct(product.id, formData);
          onClose();
        });
      }}
      className="space-y-4"
    >
      {/* Name */}
      <div>
        <label className={LABEL}>Name</label>
        <input name="name" required defaultValue={product.name} className={INPUT} />
      </div>

      {/* Description */}
      <div>
        <label className={LABEL}>Description</label>
        <textarea name="description" rows={2} defaultValue={product.description ?? ''} className={INPUT} />
      </div>

      {/* Features */}
      <div>
        <label className={LABEL}>Features (one per line)</label>
        <textarea
          name="features"
          rows={5}
          defaultValue={product.features.join('\n')}
          className={INPUT}
        />
      </div>

      {/* is_active + sort_order row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Active</label>
          <select name="is_active" defaultValue={product.is_active ? 'true' : 'false'} className={INPUT}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
        <div>
          <label className={LABEL}>Sort order</label>
          <input name="sort_order" type="number" defaultValue={product.sort_order} min={0} className={INPUT} />
        </div>
      </div>

      {/* Stripe IDs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Stripe product ID</label>
          <input name="stripe_product_id" defaultValue={product.stripe_product_id ?? ''} placeholder="prod_xxx" className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Stripe price ID</label>
          <input name="stripe_price_id" defaultValue={product.stripe_price_id ?? ''} placeholder="price_xxx" className={INPUT} />
        </div>
      </div>

      {/* Price note */}
      <p className="text-xs text-[#5C6378] bg-[#07090F] border border-[#1E2538] rounded-lg px-3 py-2 leading-relaxed">
        💡 To change the price, update it in Stripe first, then paste the new{' '}
        <code className="text-[#E8963A]">stripe_price_id</code> above.
      </p>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-[#E8963A] text-[#07090F] hover:bg-[#F2AA5E] disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="px-4 py-2 rounded-xl text-sm font-medium text-[#9DA3B4] border border-[#1E2538] hover:text-[#F5F5F0] transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  isEditing,
  isToggling,
  onEdit,
  onCancelEdit,
  onToggle,
}: {
  product: Product;
  isEditing: boolean;
  isToggling: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onToggle: (id: string, current: boolean) => void;
}) {
  return (
    <div
      className={`bg-[#13182A] border border-[#1E2538] rounded-2xl p-6 flex flex-col gap-4 transition-opacity ${
        !product.is_active && !isEditing ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {isEditing ? (
        <EditForm product={product} onClose={onCancelEdit} />
      ) : (
        <>
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#F5F5F0] leading-tight truncate">{product.name}</h3>
              {product.description && (
                <p className="mt-1 text-xs text-[#9DA3B4] line-clamp-2">{product.description}</p>
              )}
            </div>
            {/* Type badge */}
            {product.type === 'subscription' ? (
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                Subscription
              </span>
            ) : (
              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#1E2538] text-[#9DA3B4] border border-[#1E2538] whitespace-nowrap">
                One-off
              </span>
            )}
          </div>

          {/* Price + meta row */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-[#F5F5F0] tabular-nums">{fmtAUD(product.price_cents)}</span>
              {product.billing_interval && (
                <span className="ml-1 text-sm text-[#9DA3B4]">/ {product.billing_interval}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5C6378]">#{product.sort_order}</span>
              <ToggleSwitch
                id={product.id}
                isActive={product.is_active}
                disabled={isToggling}
                onToggle={onToggle}
              />
            </div>
          </div>

          {/* Features */}
          {product.features.length > 0 && (
            <ul className="space-y-1.5">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[#9DA3B4]">
                  <span className="mt-0.5 shrink-0 text-[#E8963A]">✦</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Stripe IDs */}
          <div className="pt-2 border-t border-[#1E2538] space-y-1">
            {product.stripe_product_id && (
              <p className="text-[10px] text-[#5C6378] font-mono truncate">
                <span className="text-[#5C6378]/60">prod </span>
                {product.stripe_product_id}
              </p>
            )}
            {product.stripe_price_id && (
              <p className="text-[10px] text-[#5C6378] font-mono truncate">
                <span className="text-[#5C6378]/60">price </span>
                {product.stripe_price_id}
              </p>
            )}
          </div>

          {/* Edit button */}
          <button
            type="button"
            onClick={onEdit}
            className="self-start text-xs text-[#9DA3B4] hover:text-[#E8963A] border border-[#1E2538] hover:border-[#E8963A]/40 px-3 py-1.5 rounded-lg transition-colors"
          >
            Edit
          </button>
        </>
      )}
    </div>
  );
}

// ── Main client component ─────────────────────────────────────────────────────

export function ProductsClient({ products }: { products: Product[] }) {
  const [showAddForm,  setShowAddForm]  = useState(false);
  const [editingId,    setEditingId]    = useState<string | null>(null);
  const [togglingId,   setTogglingId]   = useState<string | null>(null);
  const [,             startTransition] = useTransition();

  function handleToggle(id: string, current: boolean) {
    setTogglingId(id);
    startTransition(async () => {
      await toggleProductActive(id, current);
      setTogglingId(null);
    });
  }

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-[#9DA3B4]">{products.length} product{products.length !== 1 ? 's' : ''}</p>
        <button
          onClick={() => { setShowAddForm((v) => !v); setEditingId(null); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#E8963A] text-[#07090F] hover:bg-[#F2AA5E] transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Add Product
        </button>
      </div>

      {/* Add form */}
      {showAddForm && <AddProductForm onClose={() => setShowAddForm(false)} />}

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="bg-[#13182A] border border-[#1E2538] rounded-2xl py-16 text-center">
          <p className="text-sm text-[#5C6378]">No products yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isEditing={editingId === product.id}
              isToggling={togglingId === product.id}
              onEdit={() => { setEditingId(product.id); setShowAddForm(false); }}
              onCancelEdit={() => setEditingId(null)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
