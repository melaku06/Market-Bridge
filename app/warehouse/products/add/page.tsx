'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Save, Upload, X, Info, Plus } from 'lucide-react';
import { categoriesApi, productsApi, inventoryApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Category } from '@/lib/types';

const STEPS = ['Product Info', 'Pricing', 'Images', 'Inventory', 'SEO Info'] as const;
type Step = typeof STEPS[number];

export default function AddProductPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [imageUrl] = useState('https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=400');
  const [form, setForm] = useState({
    name: '', sku: '', barcode: '', category_id: '', brand: '',
    short_description: '', description: '',
    base_price: '', margin_percent: '18', discount_percent: '0',
    weight: '', colors: '',
    meta_title: '', meta_description: '',
  });

  useEffect(() => {
    categoriesApi.list().then((res: any) => setCategories(Array.isArray(res) ? res : res.data || [])).catch(() => {});
  }, []);

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const basePrice = parseFloat(form.base_price) || 0;
  const margin = parseFloat(form.margin_percent) || 0;
  const discount = parseFloat(form.discount_percent) || 0;
  const finalPrice = basePrice * (1 + margin / 100);
  const originalPrice = discount > 0 ? finalPrice / (1 - discount / 100) : finalPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const wid = user?.warehouse_id;
    if (!wid) return;
    setSubmitting(true);
    try {
      const product = await productsApi.create(({
        name: form.name, sku: form.sku, barcode: form.barcode as any,
        category_id: form.category_id, brand: form.brand,
        short_description: form.short_description as any, description: form.description,
        base_price: parseFloat(form.base_price),
        margin_percent: parseFloat(form.margin_percent),
        discount_percent: parseFloat(form.discount_percent),
        final_price: finalPrice, original_price: originalPrice,
        weight: form.weight ? parseFloat(form.weight) : undefined as any,
        tags, colors: form.colors ? form.colors.split(',').map(s => s.trim()) : [],
        images: [imageUrl],
        warehouse_id: wid,
        status: 'pending',
      } as any));
      await inventoryApi.create({
        product_id: (product as any).id,
        warehouse_id: wid,
        sku: form.sku,
        product_name: form.name,
        total_stock: 0, reserved_stock: 0, available_stock: 0,
        low_stock_threshold: 10, status: 'out_of_stock',
      });
      router.push('/warehouse/products');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const StepLabel = ({ index }: { index: number }) => {
    const label = STEPS[index];
    const done = index < step;
    const active = index === step;
    return (
      <button onClick={() => setStep(index)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all ${active ? 'bg-purple-600 text-white shadow-md shadow-purple-200' : done ? 'text-emerald-600 bg-emerald-50' : 'text-gray-500 hover:bg-gray-50'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border-2 ${active ? 'border-white bg-white/20 text-white' : done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300 text-gray-400'}`}>
          {done ? '✓' : index + 1}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </button>
    );
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/warehouse/products">
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft style={{ width: 15, height: 15 }} />
            Back
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details to list your product</p>
        </div>
      </div>

      {/* Pending Notice */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start gap-3">
        <Info className="text-amber-500 flex-shrink-0 mt-0.5" style={{ width: 16, height: 16 }} />
        <p className="text-xs text-amber-700">New products require admin approval before going live. Your product will be reviewed within 24 hours.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
          {/* Steps Sidebar */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 space-y-1">
            {STEPS.map((_, i) => <StepLabel key={i} index={i} />)}
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="px-6 py-5 border-b border-gray-50">
              <h2 className="text-base font-bold text-gray-900">{STEPS[step]}</h2>
            </div>
            <div className="p-6 space-y-5">
              {step === 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Product Name *" required>
                      <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Wireless Earbuds" required />
                    </Field>
                    <Field label="SKU">
                      <Input value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="Auto-generated if empty" />
                    </Field>
                    <Field label="Barcode">
                      <Input value={form.barcode} onChange={e => set('barcode', e.target.value)} placeholder="e.g. 1234567890123" />
                    </Field>
                    <Field label="Category">
                      <select value={form.category_id} onChange={e => set('category_id', e.target.value)}
                        className="w-full px-3 h-10 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white transition-all cursor-pointer">
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </Field>
                    <Field label="Brand">
                      <Input value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Samsung" />
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
                      rows={5} placeholder="Detailed product description…"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none transition-all" />
                  </Field>
                  <Field label="Tags">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map(t => (
                        <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">
                          {t}
                          <button type="button" onClick={() => setTags(tags.filter(x => x !== t))} className="hover:text-purple-800">
                            <X style={{ width: 10, height: 10 }} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add a tag" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
                      <button type="button" onClick={addTag} className="px-3 h-10 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                        <Plus style={{ width: 15, height: 15 }} />
                      </button>
                    </div>
                  </Field>
                </>
              )}

              {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Base Price (Br) *" required>
                    <Input value={form.base_price} onChange={e => set('base_price', e.target.value)} type="number" step="0.01" placeholder="0.00" required />
                  </Field>
                  <Field label="Margin (%)">
                    <Input value={form.margin_percent} onChange={e => set('margin_percent', e.target.value)} type="number" step="0.1" placeholder="18" />
                  </Field>
                  <Field label="Discount (%)">
                    <Input value={form.discount_percent} onChange={e => set('discount_percent', e.target.value)} type="number" step="0.1" placeholder="0" />
                  </Field>
                  <Field label="Colors (comma-separated)">
                    <Input value={form.colors} onChange={e => set('colors', e.target.value)} placeholder="Red, Blue, Green" />
                  </Field>
                  <div className="sm:col-span-2">
                    <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-[11px] text-gray-500 mb-1">Base Price</p>
                        <p className="text-lg font-bold text-gray-900">{basePrice.toFixed(2)} Br</p>
                      </div>
                      <div className="text-center border-x border-purple-100">
                        <p className="text-[11px] text-gray-500 mb-1">Final Price</p>
                        <p className="text-lg font-bold text-purple-600">{finalPrice.toFixed(2)} Br</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] text-gray-500 mb-1">Original Price</p>
                        <p className="text-lg font-bold text-gray-900">{originalPrice.toFixed(2)} Br</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-purple-300 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Upload className="text-purple-500" style={{ width: 20, height: 20 }} />
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Drag & drop images here</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB each</p>
                    <button type="button" className="mt-3 px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                      Browse Files
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                      <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2 bg-amber-50 border border-amber-100 rounded-2xl p-4">
                    <p className="text-xs text-amber-700">Initial stock will be set to 0. You can update inventory after product approval from the Inventory Management page.</p>
                  </div>
                  <Field label="Low Stock Alert Threshold">
                    <Input type="number" placeholder="10" defaultValue="10" />
                  </Field>
                  <Field label="Warehouse Location">
                    <Input placeholder="e.g. Shelf A-12" />
                  </Field>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-5">
                  <Field label="Meta Title">
                    <Input value={form.meta_title} onChange={e => set('meta_title', e.target.value)} placeholder="SEO page title" />
                  </Field>
                  <Field label="Meta Description">
                    <textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)}
                      rows={3} placeholder="Brief SEO description…"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none transition-all" />
                  </Field>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-50 flex items-center justify-between">
              <button type="button" onClick={() => step > 0 && setStep(s => s - 1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors ${step === 0 ? 'opacity-40 pointer-events-none' : ''}`}>
                <ArrowLeft style={{ width: 14, height: 14 }} /> Previous
              </button>
              <div className="flex items-center gap-3">
                <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  <Save style={{ width: 14, height: 14 }} /> Save Draft
                </button>
                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={() => setStep(s => s + 1)}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                    Next <ArrowRight style={{ width: 14, height: 14 }} />
                  </button>
                ) : (
                  <button type="submit" disabled={submitting}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                    {submitting ? 'Submitting…' : 'Submit for Review'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
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
