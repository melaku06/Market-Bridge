'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, CheckCircle, ArrowLeft, Send, ShoppingBag } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send reset link');
      }
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Form */}
      <div className="w-full lg:w-[480px] flex flex-col bg-white flex-shrink-0">
        <div className="px-8 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
                <ShoppingBag className="text-white" style={{ width: 18, height: 18 }} />
              </div>
              <span className="font-bold text-gray-900 text-sm tracking-tight">MarketBridge</span>
            </Link>
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Back to Login</Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            {sent ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 ring-4 ring-emerald-100">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Sent!</h1>
                <p className="text-gray-500 text-sm mb-2">
                  We&apos;ve sent a password reset link to
                </p>
                <p className="font-semibold text-gray-900 text-sm mb-8">{email}</p>

                <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                  <p className="text-xs font-semibold text-gray-700 mb-2">What to do next:</p>
                  <ol className="text-xs text-gray-500 space-y-1.5">
                    <li>1. Check your email inbox (and spam folder)</li>
                    <li>2. Click the reset link in the email</li>
                    <li>3. Create a new strong password</li>
                  </ol>
                </div>

                <Link href="/login">
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm">
                    Back to Login
                  </button>
                </Link>
                <button
                  onClick={() => setSent(false)}
                  className="w-full py-2.5 mt-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Try a different email
                </button>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Your Password?</h1>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  No worries! Enter your email address and we&apos;ll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Reset Link</>
                    )}
                  </button>

                  <div className="relative my-1">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                    <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Reset via Phone
                  </button>

                  <Link href="/login" className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </form>

                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Need help?</p>
                  <p className="text-xs text-gray-500 mb-2">Contact our support team at</p>
                  <a href="mailto:support@marketbridge.com" className="text-xs text-blue-600 hover:underline block">support@marketbridge.com</a>
                  <a href="tel:+15551234567" className="text-xs text-blue-600 hover:underline block mt-1">or call +1 (555) 123-4567</a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 bg-blue-50 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-100 rounded-full opacity-60" />
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-200 rounded-full opacity-40" />
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-30" />
        </div>

        <div className="relative z-10 text-center max-w-sm">
          {/* Mailbox illustration */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="w-full h-full rounded-3xl bg-blue-100 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-40 h-40">
                {/* Mailbox body */}
                <rect x="30" y="90" width="140" height="80" rx="8" fill="#3B82F6" />
                <rect x="30" y="90" width="140" height="40" rx="8" fill="#2563EB" />
                {/* Flag */}
                <rect x="145" y="70" width="6" height="50" fill="#6B7280" rx="2"/>
                <rect x="145" y="70" width="20" height="14" fill="#EF4444" rx="2"/>
                {/* Slot */}
                <rect x="55" y="105" width="70" height="8" rx="4" fill="#1D4ED8" />
                {/* Post */}
                <rect x="85" y="170" width="30" height="20" rx="4" fill="#6B7280" />
                {/* Envelope peaking out */}
                <path d="M60 82 L100 105 L140 82 Z" fill="#FEF3C7" />
                <rect x="60" y="65" width="80" height="40" rx="4" fill="#FFFBEB" />
                <path d="M60 65 L100 90 L140 65" stroke="#F59E0B" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Forgot Your Password?</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            No worries! Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <div className="bg-white rounded-2xl p-5 text-left shadow-sm border border-blue-100">
            <p className="text-sm font-semibold text-gray-900 mb-3">Need help?</p>
            <p className="text-xs text-gray-500 mb-3">Contact our support team at</p>
            <a href="mailto:support@marketbridge.com" className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-2">
              <Mail className="w-4 h-4" />
              support@marketbridge.com
            </a>
            <a href="tel:+15551234567" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
              <Phone className="w-4 h-4" />
              or call +1 (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
