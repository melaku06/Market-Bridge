'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, X, Save, CheckCircle, ChevronRight, Bold, Italic, Underline, List, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { useCategoriesStore } from '@/stores/categories/categories-store';
import { useProductsStore } from '@/stores/products/products-store';
import { useInventoryStore } from '@/stores/inventory/inventory-store';

const steps = [
  { id: 'info', label: 'Product Information' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'images', label: 'Images' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'variants', label: 'Variants (Optional)' },
  { id: 'seo', label: 'SEO Information' },
];

export default function AddProduct() {
  const router = useRouter();
  const { user } = useAuth();
  const { categories, fetchCategories, isLoading: categoriesLoading } = useCategoriesStore();
  const { createProduct } = useProductsStore();
  const { createInventory } = useInventoryStore();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    category: '',
    brand: '',
    sku: '',
    barcode: '',
    base_price: '',
    margin_percent: '18',
    discount_percent: '0',
    weight: '',
    tags: '',
    colors: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const loading = categoriesLoading;

  const basePrice = parseFloat(formData.base_price) || 0;
  const margin = parseFloat(formData.margin_percent) || 18;
  const finalPrice = basePrice * (1 + margin / 100);
  const discountPct = parseInt(formData.discount_percent) || 0;
  const originalPrice = discountPct > 0 ? finalPrice / (1 - discountPct / 100) : finalPrice;

  const handleSubmit = async (asDraft = false) => {
    if (!user?.warehouse_id) return;
    setSubmitting(true);
    const category = categories.find(c => c.id === formData.category);
    const newProduct = {
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description,
      short_description: formData.short_description,
      warehouse_id: user.warehouse_id,
      category_id: formData.category,
      category_name: category?.name || '',
      base_price: basePrice,
      margin_percent: margin,
      final_price: finalPrice,
      discount_percent: discountPct,
      original_price: originalPrice,
      images: images.length > 0 ? images : ['https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600'],
      rating: 0, review_count: 0, sold_count: 0,
      status: (asDraft ? 'draft' : 'pending') as any,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      brand: formData.brand,
      sku: formData.sku,
      weight: formData.weight,
      colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
    };
    try {
      const created = await createProduct(newProduct);
      if (created) {
        await createInventory({
          product_id: created.id, warehouse_id: user.warehouse_id!,
          quantity: 0, reserved_quantity: 0,
          low_stock_threshold: 10, status: 'out_of_stock' as const,
        });
      }
      setSubmitted(true);
      setTimeout(() => router.push('/warehouse/products'), 1200);
    } catch (error) {
      console.error('Failed to create product:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  const inp = "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-gray-50 focus:bg-white transition-all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/warehouse/products" className="hover:text-purple-600">Products</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Add New Product</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to add a new product.</p>
        </div>
        <button
          onClick={() => handleSubmit(false)}
          disabled={submitting || submitted}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          {submitted ? <CheckCircle className="w-4 h-4" /> : null}
          {submitted ? 'Submitted!' : 'Next: Pricing'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-6">
        {/* Left Step Nav */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
            <div className="space-y-0.5">
              {steps.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    activeStep === idx
                      ? 'bg-purple-600 text-white'
                      : idx < activeStep
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold border ${
                    activeStep === idx ? 'border-white/40 bg-white/20 text-white' :
                    idx < activeStep ? 'border-emerald-400 bg-emerald-100 text-emerald-700' :
                    'border-gray-300 text-gray-500'
                  }`}>
                    {idx < activeStep ? '✓' : idx + 1}
                  </div>
                  <span className="text-xs font-medium leading-tight">{step.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="flex-1 min-w-0">
          {/* Product Information */}
          {activeStep === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-gray-900 text-base">Product Information</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inp} placeholder="Enter product name" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SKU <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} className={inp} placeholder="Enter SKU" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Barcode (ISBN, UPC, EAN) <span className="text-gray-400 font-normal">0</span></label>
                  <input type="text" value={formData.barcode} onChange={e => setFormData({ ...formData, barcode: e.target.value })} className={inp} placeholder="Enter barcode" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                  <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inp}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Brand</label>
                  <select value={formData.brand} onChange={e => setFormData({ ...formData, brand: e.target.value })} className={inp}>
                    <option value="">Select brand</option>
                    <option value="Generic">Generic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Short Description <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.short_description}
                  onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                  className={inp}
                  placeholder="Enter short description (max 150 characters)"
                  maxLength={150}
                />
                <p className="text-right text-xs text-gray-400 mt-1">{formData.short_description.length}/150</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Detailed Description <span className="text-red-500">*</span></label>
                {/* Simple toolbar */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-100">
                    {[Bold, Italic, Underline].map((Icon, i) => (
                      <button key={i} type="button" className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600">
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                    <div className="w-px h-4 bg-gray-200 mx-1" />
                    {[List, LinkIcon, ImageIcon].map((Icon, i) => (
                      <button key={i} type="button" className="p-1.5 rounded hover:bg-gray-200 transition-colors text-gray-600">
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={6}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 text-sm focus:outline-none bg-white resize-none text-gray-700 placeholder-gray-400"
                    placeholder="Enter detailed product description..."
                    maxLength={3000}
                  />
                  <div className="px-3 py-1.5 bg-gray-50 border-t border-gray-100 text-right">
                    <span className="text-xs text-gray-400">{formData.description.length}/3000</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleSubmit(true)}
                  disabled={submitting}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Pricing */}
          {activeStep === 1 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-gray-900 text-base">Pricing</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Base Price <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Br</span>
                    <input type="number" step="0.01" value={formData.base_price} onChange={e => setFormData({ ...formData, base_price: e.target.value })} className={`${inp} pl-9`} placeholder="0.00" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Margin %</label>
                  <div className="relative">
                    <input type="number" value={formData.margin_percent} onChange={e => setFormData({ ...formData, margin_percent: e.target.value })} className={`${inp} pr-8`} placeholder="18" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Discount %</label>
                  <div className="relative">
                    <input type="number" value={formData.discount_percent} onChange={e => setFormData({ ...formData, discount_percent: e.target.value })} className={`${inp} pr-8`} placeholder="0" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                </div>
              </div>
              {basePrice > 0 && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-sm font-medium text-purple-700">Final Price: <span className="font-bold text-lg">{finalPrice.toFixed(2)} Br</span>
                    {discountPct > 0 && <span className="ml-3 line-through text-purple-400">{originalPrice.toFixed(2)} Br</span>}
                  </p>
                </div>
              )}
              <div className="flex justify-between pt-2">
                <button onClick={() => setActiveStep(0)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Back</button>
                <button onClick={() => setActiveStep(2)} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-colors">Next Step <ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* Images */}
          {activeStep === 2 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-gray-900 text-base">Product Images</h2>
              <div className="grid grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))} className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-purple-300 transition-all">
                  <Upload className="w-7 h-7 text-gray-300" />
                  <span className="text-xs text-gray-400 mt-2">Upload Image</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    if (e.target.files?.[0]) setImages([...images, 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600']);
                  }} />
                </label>
              </div>
              <p className="text-xs text-gray-400">JPG or PNG. First image will be the cover.</p>
              <div className="flex justify-between pt-2">
                <button onClick={() => setActiveStep(1)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Back</button>
                <button onClick={() => setActiveStep(3)} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-colors">Next Step <ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* Inventory */}
          {activeStep === 3 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-gray-900 text-base">Inventory</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Weight</label>
                  <input type="text" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} className={inp} placeholder="e.g. 500g" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags</label>
                  <input type="text" value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} className={inp} placeholder="wireless, bluetooth (comma separated)" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Colors</label>
                  <input type="text" value={formData.colors} onChange={e => setFormData({ ...formData, colors: e.target.value })} className={inp} placeholder="Black, White (comma separated)" />
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <button onClick={() => setActiveStep(2)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Back</button>
                <button onClick={() => setActiveStep(4)} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-colors">Next Step <ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* Variants */}
          {activeStep === 4 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-gray-900 text-base">Variants <span className="text-gray-400 font-normal text-sm">(Optional)</span></h2>
              <p className="text-sm text-gray-500">Add product variants like different sizes or colors. This step is optional.</p>
              <div className="flex justify-between pt-2">
                <button onClick={() => setActiveStep(3)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Back</button>
                <button onClick={() => setActiveStep(5)} className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-colors">Next Step <ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* SEO */}
          {activeStep === 5 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <h2 className="font-semibold text-gray-900 text-base">SEO Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
                <input type="text" value={formData.name} className={inp} placeholder="SEO title" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
                <textarea rows={3} value={formData.short_description} className={`${inp} resize-none`} placeholder="SEO description" readOnly />
              </div>
              <div className="flex justify-between pt-2">
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={submitting}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting || submitted}
                  className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl font-semibold text-sm transition-colors"
                >
                  {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {submitted ? 'Submitted!' : submitting ? 'Submitting...' : 'Next: Pricing'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
