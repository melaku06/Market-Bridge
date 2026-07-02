'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Upload, CheckCircle, Search, ClipboardList } from 'lucide-react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const categories = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports', 'Toys & Baby', 'Automotive', 'Books', 'Other'];

const submittedRequests = [
  { id: '1', name: 'Sony WH-1000XM5 Headphones', status: 'In Review', date: 'May 15, 2024' },
  { id: '2', name: 'Nike Air Max 270', status: 'Found', date: 'Apr 28, 2024' },
  { id: '3', name: 'Dyson V12 Vacuum', status: 'Pending', date: 'Apr 10, 2024' },
];

export default function ProductRequestPage() {
  const [form, setForm] = useState({ name: '', category: '', description: '', brand: '', email: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  const statusColor: Record<string, string> = {
    Pending: 'bg-yellow-100 text-yellow-700',
    'In Review': 'bg-blue-100 text-blue-700',
    Found: 'bg-green-100 text-green-700',
    'Not Available': 'bg-red-100 text-red-700',
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
              <p className="text-gray-500 text-sm text-center">Tell us what product you need, and we'll try to get it for you.</p>
            </div>

            {/* Form */}
            <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-gray-500 text-sm mb-4">Our team will review your request and get back to you soon.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', category: '', description: '', brand: '', email: '' }); }} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">Submit a Product Request</h2>
                  <p className="text-gray-500 text-sm mb-5">Our team will review your request and get back to you soon.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">Product Name *</label>
                        <input
                          type="text"
                          placeholder="Enter product name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                          <option value="">Select category</option>
                          {categories.map((c) => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Product Description *</label>
                      <textarea
                        placeholder="Describe the product you are looking for..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none resize-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Preferred Brand (Optional)</label>
                      <input
                        type="text"
                        placeholder="Enter brand name"
                        value={form.brand}
                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Upload Image (Optional)</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 transition-colors cursor-pointer">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1.5" />
                        <p className="text-xs text-gray-500">Click to upload an image</p>
                        <p className="text-xs text-gray-400">or drag and drop (JPG, PNG up to 5MB)</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Your Email *</label>
                      <input
                        type="email"
                        placeholder="Enter your email address"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting...</> : 'Submit Request'}
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Right: How It Works + Need Help */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-4">
                  {[
                    { step: 1, title: 'Submit Request', desc: 'Fill in the details of the product you need.' },
                    { step: 2, title: 'We Search', desc: 'Our team will look for the best options for you.' },
                    { step: 3, title: 'Get Notified', desc: "We'll notify you when the product is available." },
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

              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
                <p className="text-sm text-gray-500 mb-2">Contact our support team at</p>
                <a href="mailto:support@marketbridge.com" className="text-sm text-blue-600 hover:underline block mb-1">support@marketbridge.com</a>
                <p className="text-sm text-gray-500 mb-1">or call</p>
                <a href="tel:+15551234567" className="text-sm text-blue-600 hover:underline">+1 (555) 123-4567</a>
              </div>

              {/* Submitted Requests */}
              {submittedRequests.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">My Requests</h3>
                  <div className="space-y-3">
                    {submittedRequests.map((req) => (
                      <div key={req.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-gray-900 line-clamp-1">{req.name}</p>
                          <p className="text-xs text-gray-400">{req.date}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[req.status] || 'bg-gray-100 text-gray-600'}`}>
                          {req.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
