'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShoppingBag, Check, User, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pwError, setPwError] = useState('');

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    if (k === 'confirm' || k === 'password') setPwError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setPwError('Passwords do not match'); return; }
    if (!terms) { setError('Please accept the terms'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: 'customer' }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); return; }
      await refreshUser();
      router.push('/dashboard');
    } catch { setError('An error occurred.'); }
    finally { setLoading(false); }
  };

  const BENEFITS = [
    { icon: '🛍️', t: 'Exclusive Deals', s: 'Members-only discounts' },
    { icon: '❤️', t: 'Wishlist', s: 'Save your favorites' },
    { icon: '⚡', t: 'Fast Checkout', s: 'Saved addresses' },
    { icon: '📦', t: 'Order Tracking', s: 'Real-time updates' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left – Form */}
        <div className="flex-1 p-8 lg:p-10 overflow-y-auto">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
              <ShoppingBag className="text-white" style={{ width: 15, height: 15 }} />
            </div>
            <span className="font-bold text-gray-900">MarketBridge</span>
          </Link>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create Account</h1>
          <p className="text-sm text-gray-500 mb-6">Join thousands of shoppers today</p>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 14, height: 14 }} />
                <input type="text" value={form.name} onChange={set('name')} required placeholder="Your full name"
                  className="w-full pl-10 pr-4 h-11 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 14, height: 14 }} />
                  <input type="email" value={form.email} onChange={set('email')} required placeholder="you@example.com"
                    className="w-full pl-10 pr-4 h-11 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 14, height: 14 }} />
                  <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+251 9XX XXX XXX"
                    className="w-full pl-10 pr-4 h-11 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 14, height: 14 }} />
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={set('password')} required placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-10 h-11 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPw ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 14, height: 14 }} />
                  <input type="password" value={form.confirm} onChange={set('confirm')} required placeholder="Repeat password"
                    className={`w-full pl-10 pr-4 h-11 border rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${pwError ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'}`} />
                </div>
                {pwError && <p className="text-xs text-red-500 mt-1">{pwError}</p>}
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 mt-0.5" />
              <span className="text-xs text-gray-500">
                I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
              </span>
            </label>

            <button type="submit" disabled={loading || !terms}
              className="w-full h-11 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 shadow-lg shadow-blue-100"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or sign up with</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[{l:'Google',i:'🔵'},{l:'Apple',i:'🍎'}].map(p => (
              <button key={p.l} className="h-11 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <span>{p.i}</span> {p.l}
              </button>
            ))}
          </div>

          <p className="text-sm text-center text-gray-500 mt-5">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-800">Sign in</Link>
          </p>
        </div>

        {/* Right – Benefits */}
        <div className="hidden lg:flex flex-col justify-center flex-1 p-10 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="relative z-10 text-white">
            <h2 className="text-2xl font-extrabold mb-2">Join MarketBridge</h2>
            <p className="text-blue-200 text-sm mb-8">Discover the best products at the best prices.</p>
            <div className="grid grid-cols-2 gap-4">
              {BENEFITS.map(b => (
                <div key={b.t} className="bg-white/10 rounded-2xl p-4">
                  <div className="text-2xl mb-2">{b.icon}</div>
                  <p className="text-sm font-bold">{b.t}</p>
                  <p className="text-xs text-blue-200 mt-0.5">{b.s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
