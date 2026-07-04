'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Mail, CheckCircle2, Phone } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [tab, setTab] = useState<'email' | 'phone'>('email');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left – Form */}
        <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
              <ShoppingBag className="text-white" style={{ width: 15, height: 15 }} />
            </div>
            <span className="font-bold text-gray-900">MarketBridge</span>
          </Link>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-emerald-500" style={{ width: 32, height: 32 }} />
              </div>
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Check your inbox</h2>
              <p className="text-sm text-gray-500 mb-6">
                We sent password reset instructions to<br />
                <span className="font-semibold text-gray-800">{email}</span>
              </p>
              <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="text-blue-600 font-medium hover:underline">try again</button>.
              </div>
              <Link href="/login">
                <button className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-800 mx-auto transition-colors">
                  <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Login
                </button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Reset Password</h1>
              <p className="text-sm text-gray-500 mb-7">Enter your details and we'll send you reset instructions</p>

              {/* Tab */}
              <div className="flex border border-gray-200 rounded-xl p-1 mb-6">
                {(['email', 'phone'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    {t === 'email' ? 'Email' : 'Phone'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    {tab === 'email' ? 'Email Address' : 'Phone Number'}
                  </label>
                  <div className="relative">
                    {tab === 'email'
                      ? <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 15, height: 15 }} />
                      : <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 15, height: 15 }} />}
                    <input
                      type={tab === 'email' ? 'email' : 'tel'}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder={tab === 'email' ? 'you@example.com' : '+251 9XX XXX XXX'}
                      className="w-full pl-10 pr-4 h-11 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full h-11 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 shadow-lg shadow-blue-100"
                  style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
                  {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Send Reset Instructions'}
                </button>
              </form>

              <div className="mt-5 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs text-blue-700 font-medium mb-1">Need help?</p>
                <p className="text-xs text-blue-600">Contact our support team at <a href="mailto:support@marketbridge.com" className="underline">support@marketbridge.com</a></p>
              </div>

              <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 mt-6 transition-colors">
                <ArrowLeft style={{ width: 14, height: 14 }} /> Back to Login
              </Link>
            </>
          )}
        </div>

        {/* Right – Illustration */}
        <div className="hidden lg:flex flex-col justify-center flex-1 p-10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="relative z-10 text-white text-center">
            {/* SVG Mailbox Illustration */}
            <div className="w-32 h-32 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Mail className="text-white" style={{ width: 56, height: 56 }} />
            </div>
            <h2 className="text-xl font-extrabold mb-2">Check Your Email</h2>
            <p className="text-blue-200 text-sm max-w-xs mx-auto mb-8">
              We'll send secure reset instructions to your registered email or phone number.
            </p>
            <div className="bg-white/10 rounded-2xl p-4 text-sm text-left">
              <p className="font-semibold mb-2">Need immediate help?</p>
              <p className="text-blue-200 text-xs">Email: support@marketbridge.com</p>
              <p className="text-blue-200 text-xs mt-1">Phone: +251 911 234 567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
