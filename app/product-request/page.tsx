'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Upload, CheckCircle, ClipboardList, Eye, Trash2 } from 'lucide-react';
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
  not_available: 'Not Available',
};

export default function ProductRequestPage() {
  const [form, setForm] = useState({ product_name: '', category: '', description: '', brand: '' });
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
        customer_email: 'sarah.johnson@email.com',
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
            <div className="hidden lg:flex flex-col items-center justify-center bg-blue-50 rounded-2xl p-8">
              <div className="w-40 h-40 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                <ClipboardList className="w-20 h-20 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Can't find what you're looking for?</h3>
              <p className="text-gray-500 text-sm text-center">Tell us what product you need, and we'll source it for you.</p>
              <div className="mt-6 space-y-3 w-full">
                {[
                  { step: '1', title: 'Submit Request', desc: 'Fill in the product details below.' },
                  { step: '2', title: 'We Search', desc: 'Our team searches for the best options.' },
                  { step: '3', title: 'Get Notified', desc: "You'll be notified when it's available." },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{item.step}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-gray-500 text-sm mb-4">Our team will review your request and get back to you soon.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ product_name: '', category: '', description: '', brand: '' }); }}
                    className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Request a Product</h2>
                  <p className="text-gray-500 text-sm mb-5">Can't find what you're looking for? Let us know!</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Product Name *</label>
                      <input
                        type="text"
                        placeholder="Enter product name"
                        value={form.product_name}
                        onChange={(e) => setForm({ ...form, product_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none bg-white"
                      >
                        <option value="">Select a category</option>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Brand (Optional)</label>
                      <input
                        type="text"
                        placeholder="Enter brand name"
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Description *</label>
                      <textarea
                        placeholder="Describe the product features, specifications, etc."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Reference Image (Optional)</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 transition-colors cursor-pointer">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                        <p className="text-xs text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
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

            {/* Right: History + Info */}
            <div className="space-y-4">
              {/* My Request History */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Your Request History</h3>
                {fetchingRequests ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  </div>
                ) : requests.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No requests yet.</p>
                ) : (
                  <div className="space-y-3">
                    {requests.map((req) => (
                      <div key={req.id} className="flex items-start justify-between py-2 border-b border-gray-50 last:border-0 gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{req.product_name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(req.created_at).toLocaleDateString('en-ET', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          {req.category && <p className="text-xs text-gray-400">{req.category}</p>}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[req.status] || 'bg-gray-100 text-gray-600'}`}>
                            {STATUS_LABELS[req.status] || req.status}
                          </span>
                          {req.status === 'pending' && (
                            <button
                              onClick={() => handleDelete(req.id)}
                              className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Need Help */}
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <p className="text-sm text-gray-500 mb-2">Our support team is here for you.</p>
                <a href="mailto:support@marketbridge.com" className="text-sm text-blue-600 hover:underline block">
                  support@marketbridge.com
                </a>
              </div>

              {/* Mobile: How it works */}
              <div className="lg:hidden bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Submit Request', desc: 'Fill in the product details.' },
                    { step: 2, title: 'We Search', desc: 'Our team searches for the best options.' },
                    { step: 3, title: 'Get Notified', desc: "You'll be notified when available." },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{item.step}</div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
