'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Upload, X, Package, Eye } from 'lucide-react';
import { productsApi, categoriesApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Category, Product } from '@/lib/types';

const STATUS_OPTS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export default function EditProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', sku: '', barcode: '', category_id: '', brand: '',
    short_description: '', description: '',
    base_price: '', margin_percent: '', discount_percent: '',
    weight: '', status: '',
  });

  useEffect(() => {
    categoriesApi.list().then((res: any) => setCategories(Array.isArray(res) ? res : res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    productsApi.get(id).then((p: any) => {
      setProduct(p);
      setForm({
        name: p.name || '',
        sku: p.sku || '',
        barcode: p.barcode || '',
        category_id: p.category_id || '',
        brand: p.brand || '',
        short_description: p.short_description || '',
        description: p.description || '',
        base_price: String(p.base_price || ''),
        margin_percent: String(p.margin_percent || '18'),
        discount_percent: String(p.discount_percent || '0'),
        weight: String(p.weight || ''),
        status: p.status || 'draft',
      });
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const basePrice = parseFloat(form.base_price) || 0;
  const margin = parseFloat(form.margin_percent) || 0;
  const discount = parseFloat(form.discount_percent) || 0;
  const finalPrice = basePrice * (1 + margin / 100);
  const originalPrice = discount > 0 ? finalPrice / (1 - discount / 100) : finalPrice;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await productsApi.update(id, ({
        name: form.name, sku: form.sku, barcode: form.barcode as any,
        category_id: form.category_id, brand: form.brand,
        short_description: form.short_description as any, description: form.description,
        base_price: parseFloat(form.base_price),
        margin_percent: parseFloat(form.margin_percent),
        discount_percent: parseFloat(form.discount_percent),
        final_price: finalPrice, original_price: originalPrice,
        weight: form.weight ? parseFloat(form.weight) : undefined as any,
        status: form.status as any,
      } as any));
      router.push('/warehouse/products');
    } catch (err) { console.error(err); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/warehouse/products">
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft style={{ width: 15, height: 15 }} />Back
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">{product?.name}</p>
        </div>
        <Link href={`/products/${id}`} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Eye style={{ width: 14, height: 14 }} /> Preview
        </Link>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Main form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info */}
            <Section title="Product Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Product Name *">
                  <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Product name" required />
                </Field>
                <Field label="SKU">
                  <Input value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="SKU" />
                </Field>
                <Field label="Barcode">
                  <Input value={form.barcode} onChange={e => set('barcode', e.target.value)} placeholder="Barcode" />
                </Field>
                <Field label="Category">
                  <select value={form.category_id} onChange={e => set('category_id', e.target.value)}
                    className="w-full px-3 h-10 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white transition-all cursor-pointer">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </Field>
                <Field label="Brand">
                  <Input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Brand" />
                </Field>
                <Field label="Weight (kg)">
                  <Input value={form.weight} onChange={e => set('weight', e.target.value)} type="number" step="0.01" placeholder="0.00" />
                </Field>
              </div>
              <Field label="Short Description">
                <Input value={form.short_description} onChange={e => set('short_description', e.target.value)} placeholder="One-line summary" />
              </Field>
              <Field label="Full Description">
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  rows={5} placeholder="Detailed description…"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none transition-all" />
              </Field>
            </Section>

            {/* Pricing */}
            <Section title="Pricing">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Field label="Base Price (Br)">
                  <Input value={form.base_price} onChange={e => set('base_price', e.target.value)} type="number" step="0.01" placeholder="0.00" />
                </Field>
                <Field label="Margin (%)">
                  <Input value={form.margin_percent} onChange={e => set('margin_percent', e.target.value)} type="number" step="0.1" placeholder="18" />
                </Field>
                <Field label="Discount (%)">
                  <Input value={form.discount_percent} onChange={e => set('discount_percent', e.target.value)} type="number" step="0.1" placeholder="0" />
                </Field>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 grid grid-cols-3 gap-4 text-center">
                <div><p className="text-[11px] text-gray-500 mb-1">Base</p><p className="text-base font-bold text-gray-800">{basePrice.toFixed(2)} Br</p></div>
                <div className="border-x border-purple-100"><p className="text-[11px] text-gray-500 mb-1">Final</p><p className="text-base font-bold text-purple-600">{finalPrice.toFixed(2)} Br</p></div>
                <div><p className="text-[11px] text-gray-500 mb-1">Original</p><p className="text-base font-bold text-gray-800">{originalPrice.toFixed(2)} Br</p></div>
              </div>
            </Section>

            {/* Images */}
            <Section title="Images">
              <div className="flex gap-3 flex-wrap">
                {product?.images?.map((img, i) => (
                  <div key={i} className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 relative group">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button type="button" className="text-white"><X style={{ width: 16, height: 16 }} /></button>
                    </div>
                  </div>
                ))}
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-purple-300 transition-colors text-gray-400">
                  <Upload style={{ width: 16, height: 16 }} />
                  <span className="text-[10px]">Add</span>
                </div>
              </div>
            </Section>
          </div>

          {/* Right panel */}
          <div className="space-y-5 sticky top-5">
            {/* Preview card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Product Preview</h3>
              <div className="rounded-xl overflow-hidden bg-gray-50 aspect-video flex items-center justify-center border border-gray-100">
                {product?.images?.[0]
                  ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                  : <Package className="text-gray-300" style={{ width: 40, height: 40 }} />}
              </div>
              <div className="mt-3">
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">{form.name || 'Product Name'}</p>
                <p className="text-lg font-bold text-purple-600 mt-1">{finalPrice.toFixed(2)} Br</p>
                {originalPrice > finalPrice && (
                  <p className="text-xs text-gray-400 line-through">{originalPrice.toFixed(2)} Br</p>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Status</h3>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full px-3 h-10 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white cursor-pointer">
                {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2.5">
              <button type="button" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Save style={{ width: 14, height: 14 }} /> Save Draft
              </button>
              <button type="submit" disabled={saving}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-50">
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className={`w-full px-3 h-10 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all ${props.className || ''}`} />
  );
}
