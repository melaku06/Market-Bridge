'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ChevronRight, Upload, CheckCircle2, Clock, X, Search as SearchIcon, HelpCircle } from 'lucide-react';
import { productRequestsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Books', 'Toys', 'Food & Beverages', 'Other'];
const HOW_IT_WORKS = [
  { step: '01', title: 'Submit Request', desc: 'Fill out the product request form with details.' },
  { step: '02', title: 'We Search', desc: 'Our team searches our warehouse network.' },
  { step: '03', title: 'You Get Notified', desc: 'We notify you when the product is available.' },
];

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-100',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  fulfilled: 'bg-blue-50 text-blue-700 border border-blue-100',
  rejected: 'bg-red-50 text-red-700 border border-red-100',
};

export default function ProductRequestPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', category: '', brand: '', description: '', price_min: '', price_max: '', email: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const customerId = user?.id || 'usr-001';

  useEffect(() => {
    productRequestsApi.list({ customer_id: customerId }).then((res: any) => {
      setRequests(Array.isArray(res) ? res : res.data || []);
    }).catch(() => {});
  }, [customerId]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newReq = await productRequestsApi.create({
        customer_id: customerId,
        product_name: form.name,
        category: form.category,
        brand: form.brand,
        description: form.description,
        customer_email: form.email || user?.email || '',
        status: 'pending',
      } as any);
      setRequests(r => [newReq, ...r]);
      setSubmitted(true);
      setForm({ name: '', category: '', brand: '', description: '', price_min: '', price_max: '', email: '', notes: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (e) { console.error(e); }
    finally { setSubmitting(false); }
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <span className="text-gray-900 font-medium">Request a Product</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="text-blue-600" style={{ width: 24, height: 24 }} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Can't Find What You're Looking For?</h1>
            <p className="text-sm text-gray-500 max-w-lg mx-auto">
              Submit a product request and our team will source it from our warehouse network.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Form */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="px-6 py-5 border-b border-gray-50">
                <h2 className="text-base font-bold text-gray-900">Product Request Form</h2>
                <p className="text-xs text-gray-400 mt-0.5">Fields marked * are required</p>
              </div>

              {submitted && (
                <div className="mx-6 mt-5 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500 flex-shrink-0" style={{ width: 20, height: 20 }} />
                  <p className="text-sm font-medium text-emerald-700">Request submitted! We'll get back to you within 24 hours.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Product Name *">
                    <Input value={form.name} onChange={set('name')} placeholder="e.g. iPhone 15 Pro Max" required />
                  </Field>
                  <Field label="Category *">
                    <select value={form.category} onChange={set('category')} required
                      className="w-full px-3 h-10 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white transition-all cursor-pointer">
                      <option value="">Select category</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Preferred Brand">
                    <Input value={form.brand} onChange={set('brand')} placeholder="e.g. Apple, Samsung" />
                  </Field>
                  <Field label="Contact Email">
                    <Input type="email" value={form.email} onChange={set('email')} placeholder={user?.email || 'your@email.com'} />
                  </Field>
                </div>

                <Field label="Description *">
                  <textarea value={form.description} onChange={set('description')} required rows={4}
                    placeholder="Describe the product, any specific features, model numbers, etc."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none transition-all" />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Min Price (Br)">
                    <Input type="number" value={form.price_min} onChange={set('price_min')} placeholder="0" />
                  </Field>
                  <Field label="Max Price (Br)">
                    <Input type="number" value={form.price_max} onChange={set('price_max')} placeholder="Any" />
                  </Field>
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Reference Image (optional)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
                    <Upload className="text-gray-300 mx-auto mb-2" style={{ width: 24, height: 24 }} />
                    <p className="text-xs text-gray-400">Click or drag & drop image here</p>
                    <p className="text-[11px] text-gray-300 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>

                <Field label="Additional Notes">
                  <textarea value={form.notes} onChange={set('notes')} rows={3}
                    placeholder="Any other details that might help us find your product"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 resize-none transition-all" />
                </Field>

                <button type="submit" disabled={submitting}
                  className="w-full h-11 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 shadow-lg shadow-blue-100"
                  style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
                  {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Submit Request'}
                </button>
              </form>
            </div>

            {/* Right panel */}
            <div className="space-y-5">
              {/* How it works */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-4">
                  {HOW_IT_WORKS.map(s => (
                    <div key={s.step} className="flex gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
                        {s.step}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Support */}
              <div className="rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                    <HelpCircle style={{ width: 18, height: 18 }} />
                  </div>
                  <h3 className="text-sm font-bold">Need Help?</h3>
                </div>
                <p className="text-xs text-blue-200 mb-4">Our team responds within 24 hours to all product requests.</p>
                <a href="mailto:support@marketbridge.com"
                  className="block w-full py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-semibold text-center transition-colors">
                  Contact Support
                </a>
              </div>
            </div>
          </div>

          {/* Request History */}
          {requests.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Your Requests</h3>
                <span className="text-xs text-gray-400">{requests.length} requests</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/70">
                      {['Request ID', 'Product', 'Category', 'Date', 'Status', ''].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {requests.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3.5 text-xs font-mono text-gray-500">#{(r.id || '').slice(0, 8).toUpperCase()}</td>
                        <td className="px-4 py-3.5 text-sm font-medium text-gray-800 max-w-[160px]">
                          <p className="truncate">{r.product_name}</p>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-gray-500">{r.category || '—'}</td>
                        <td className="px-4 py-3.5 text-xs text-gray-400">
                          {r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[r.status] || 'bg-gray-100 text-gray-500'}`}>
                            {r.status || 'pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <X style={{ width: 13, height: 13 }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
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
      className={`w-full px-3 h-10 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all ${props.className || ''}`} />
  );
}
