'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Save, Tag, Package, DollarSign, Info, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { productsApi, categoriesApi, inventoryApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Category } from '@/lib/types';

export default function AddProduct() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    category: '',
    base_price: '',
    margin_percent: '18',
    discount_percent: '0',
    sku: '',
    brand: '',
    weight: '',
    tags: '',
    colors: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await categoriesApi.list();
        setCategories(res);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const basePrice = parseFloat(formData.base_price) || 0;
  const margin = parseFloat(formData.margin_percent) || 18;
  const finalPrice = basePrice * (1 + margin / 100);
  const discountPct = parseInt(formData.discount_percent) || 0;
  const originalPrice = discountPct > 0 ? finalPrice / (1 - discountPct / 100) : finalPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      rating: 0,
      review_count: 0,
      sold_count: 0,
      status: 'pending' as const,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      brand: formData.brand,
      sku: formData.sku,
      weight: formData.weight,
      colors: formData.colors.split(',').map(c => c.trim()).filter(Boolean),
    };

    try {
      const created = await productsApi.create(newProduct);
      await inventoryApi.create({
        product_id: created.id,
        product_name: created.name,
        warehouse_id: user.warehouse_id,
        sku: created.sku || '',
        total_stock: 0,
        reserved_stock: 0,
        available_stock: 0,
        low_stock_threshold: 10,
        status: 'out_of_stock' as const,
      });
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
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const field = (label: string, required = false) => (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/warehouse/products">
          <button className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors border border-gray-200">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Product</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to list your product.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Main */}
          <div className="lg:col-span-2 space-y-5">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Package className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <h2 className="font-bold text-gray-900">Basic Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  {field('Product Name', true)}
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all"
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {field('Category', true)}
                    <select
                      required
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                    >
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    {field('SKU')}
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={e => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all"
                      placeholder="Product SKU"
                    />
                  </div>
                </div>
                <div>
                  {field('Short Description')}
                  <input
                    type="text"
                    value={formData.short_description}
                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all"
                    placeholder="Brief product summary"
                  />
                </div>
                <div>
                  {field('Full Description')}
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all resize-none"
                    placeholder="Detailed product description..."
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <h2 className="font-bold text-gray-900">Pricing</h2>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  {field('Base Price', true)}
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Br</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.base_price}
                      onChange={e => setFormData({ ...formData, base_price: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  {field('Margin %')}
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={formData.margin_percent}
                      onChange={e => setFormData({ ...formData, margin_percent: e.target.value })}
                      className="w-full px-3.5 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all"
                      placeholder="18"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                </div>
                <div>
                  {field('Discount %')}
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.discount_percent}
                      onChange={e => setFormData({ ...formData, discount_percent: e.target.value })}
                      className="w-full px-3.5 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all"
                      placeholder="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                </div>
              </div>
              {basePrice > 0 && (
                <div className="mt-4 p-3.5 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-medium text-blue-700">
                    Final Price: <span className="font-bold text-base">{finalPrice.toLocaleString()} Br</span>
                    {discountPct > 0 && <span className="ml-2 line-through text-blue-400">{originalPrice.toLocaleString()} Br</span>}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <h2 className="font-bold text-gray-900">Additional Details</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  {field('Brand')}
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all"
                    placeholder="Brand name"
                  />
                </div>
                <div>
                  {field('Weight')}
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={e => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all"
                    placeholder="e.g., 500g"
                  />
                </div>
                <div>
                  {field('Tags')}
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all"
                    placeholder="wireless, bluetooth (comma separated)"
                  />
                </div>
                <div>
                  {field('Colors')}
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={e => setFormData({ ...formData, colors: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all"
                    placeholder="Black, White, Blue (comma separated)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-5">
            {/* Images */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-3.5 h-3.5 text-violet-600" />
                </div>
                <h2 className="font-bold text-gray-900">Product Images</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all">
                  <Upload className="w-6 h-6 text-gray-300" />
                  <span className="text-xs text-gray-400 mt-1.5">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files?.[0]) {
                        setImages([...images, 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=600']);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-3">JPG or PNG. First image will be the cover.</p>
            </div>

            {/* Review Info */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Pending Review</p>
                  <p className="text-xs text-amber-700 leading-relaxed">Your product will be reviewed by the admin team before being published. This usually takes 1-2 business days.</p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <button
                type="submit"
                disabled={submitting || submitted}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-600/20"
              >
                {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {submitted && <CheckCircle className="w-4 h-4" />}
                {!submitting && !submitted && <Save className="w-4 h-4" />}
                {submitted ? 'Submitted!' : submitting ? 'Submitting...' : 'Submit for Review'}
              </button>
              <Link href="/warehouse/products">
                <button type="button" className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700">
                  Cancel
                </button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
