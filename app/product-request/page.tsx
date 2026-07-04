'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Upload, CheckCircle, Eye, Trash2, Search, Bell } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { productRequestsApi } from '@/lib/api';
import type { ProductRequest } from '@/lib/types';

const CATEGORIES = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Toys & Baby', 'Automotive', 'Books', 'Other'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_review: 'bg-blue-100 text-blue-700',
  found: 'bg-green-100 text-green-700',
  not_available: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_review: 'In Review',
  found: 'Found',
  not_available: 'Not Found',
};

export default function ProductRequestPage() {
  const [form, setForm] = useState({
    product_name: '',
    category: '',
    description: '',
    brand: '',
    min_price: '',
    max_price: '',
    notes: '',
  });
  const [requests, setRequests] = useState<ProductRequest[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingRequests, setFetchingRequests] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setFetchingRequests(true);
    try {
      const res = await productRequestsApi.list({ customer_id: 'usr-001' });
      const data = Array.isArray(res) ? res : (res as { data?: ProductRequest[] }).data || [];
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    } finally {
      setFetchingRequests(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await productRequestsApi.create({
        customer_id: 'usr-001',
        customer_email: 'customer@demo.com',
        product_name: form.product_name,
        category: form.category,
        description: form.description,
        brand: form.brand,
      });
      setSubmitted(true);
      await fetchRequests();
    } catch (error) {
      console.error('Failed to submit request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productRequestsApi.delete(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Failed to delete request:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Product Request</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Illustration */}
            <div className="hidden lg:flex flex-col items-center justify-center bg-blue-600 rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-20 h-20 bg-white rounded-full" />
                <div className="absolute bottom-8 right-8 w-32 h-32 bg-white rounded-full" />
              </div>
              <div className="relative z-10">
                <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <svg viewBox="0 0 160 160" className="w-full h-full">
                    <rect x="20" y="100" width="120" height="50" rx="8" fill="white" opacity="0.2"/>
                    <rect x="10" y="80" width="140" height="60" rx="8" fill="white" opacity="0.3"/>
                    <rect x="30" y="50" width="100" height="80" rx="8" fill="white" opacity="0.9"/>
                    <text x="80" y="90" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#2563EB">REQ</text>
                    <circle cx="50" cy="70" r="8" fill="#3B82F6"/>
                    <circle cx="80" cy="70" r="8" fill="#3B82F6"/>
                    <circle cx="110" cy="70" r="8" fill="#3B82F6"/>
                    <path d="M55 120 L80 140 L105 120" fill="#60A5FA" opacity="0.6"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Can&apos;t find what you&apos;re looking for?</h3>
                <p className="text-blue-100 text-sm leading-relaxed">
                  Tell us what product you need, and we&apos;ll try to get it for you.
                </p>
              </div>
            </div>

            {/* Middle: Form */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-gray-500 text-sm mb-6">Our team will review your request and get back to you soon.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ product_name: '', category: '', description: '', brand: '', min_price: '', max_price: '', notes: '' }); }}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-gray-900 mb-0.5">Request a Product</h2>
                  <p className="text-gray-500 text-sm mb-5">Can&apos;t find what you&apos;re looking for? Let us know!</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Name *</label>
                        <input
                          type="text"
                          placeholder="Enter product name"
                          value={form.product_name}
                          onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category *</label>
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                          required
                        >
                          <option value="">Select a category</option>
                          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Brand (Optional)</label>
                      <input
                        type="text"
                        placeholder="Enter brand name"
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Detailed Description *</label>
                      <textarea
                        placeholder="Describe the product you are looking for, features, specifications, etc."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none resize-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Preferred Price Range (USD)</label>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="number"
                          placeholder="Min Price"
                          value={form.min_price}
                          onChange={(e) => setForm({ ...form, min_price: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          min="0"
                        />
                        <input
                          type="number"
                          placeholder="Max Price"
                          value={form.max_price}
                          onChange={(e) => setForm({ ...form, max_price: e.target.value })}
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Reference Image (Optional)</label>
                      <label className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-blue-300 transition-colors cursor-pointer flex flex-col items-center gap-2 bg-gray-50 hover:bg-blue-50/30">
                        <Upload className="w-6 h-6 text-gray-400" />
                        <div>
                          <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">Click to upload</span>
                          <span className="text-xs text-gray-500"> or drag and drop</span>
                        </div>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                        <input type="file" className="hidden" accept="image/*" />
                      </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">Additional Notes (Optional)</label>
                      <textarea
                        placeholder="Any other information that might help us find this product."
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none resize-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      {loading
                        ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</>
                        : 'Submit Request'
                      }
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Right: How it works + Need Help */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-4">
                  {[
                    { step: 1, icon: CheckCircle, title: 'Submit Request', desc: 'Fill in the details of the product you need.', color: 'text-blue-600 bg-blue-50' },
                    { step: 2, icon: Search, title: 'We Search', desc: 'Our team will look for the best options for you.', color: 'text-green-600 bg-green-50' },
                    { step: 3, icon: Bell, title: 'Get Notified', desc: 'We\'ll notify you when the product is available.', color: 'text-orange-600 bg-orange-50' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.step} className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                            <span className="text-xs font-bold">{item.step}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-500 mb-3">Contact our support team</p>
                <a href="mailto:support@marketbridge.com" className="text-sm text-blue-600 hover:underline block">
                  support@marketbridge.com
                </a>
                <a href="tel:+15551234567" className="text-sm text-blue-600 hover:underline block mt-1">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>

          {/* Request History Table */}
          <div className="mt-6 bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">Your Request History</h3>
            </div>
            {fetchingRequests ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm text-gray-500">No requests yet. Submit your first request above!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Request ID</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product Name</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Requested On</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-mono text-gray-600">{req.id.slice(0, 12).toUpperCase()}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-medium text-gray-900">{req.product_name}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm text-gray-600">{req.category || '—'}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm text-gray-600">
                            {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[req.status] || 'bg-gray-100 text-gray-600'}`}>
                            {STATUS_LABELS[req.status] || req.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            {req.status === 'pending' && (
                              <button
                                onClick={() => handleDelete(req.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* How it works - bottom */}
          <div className="mt-6 bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-bold text-gray-900 mb-6 text-center">How it works?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: 1, icon: '📋', title: 'Submit Request', desc: 'Fill out the form with details of the product you need.' },
                { step: 2, icon: '🔍', title: 'We Search', desc: 'Our team searches for the best options for you.' },
                { step: 3, icon: '🔔', title: 'Get Updates', desc: 'We notify you when the product is available.' },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl mb-3">
                    {item.icon}
                  </div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{item.step}. {item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
