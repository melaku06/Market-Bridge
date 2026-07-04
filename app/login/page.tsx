'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShoppingBag, ShieldCheck, Truck, RotateCcw, Headphones, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';

const getDashboardPath = (role?: string) => {
  if (role === 'admin') return '/admin';
  if (role === 'warehouse') return '/warehouse';
  return '/dashboard';
};

export default function LoginPage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) router.replace(getDashboardPath(user.role));
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      await refreshUser();
      router.push(getDashboardPath(data.data?.role || data.role));
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (e: string, pw: string) => {
    setEmail(e); setPassword(pw);
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: e, password: pw }), credentials: 'include' });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); return; }
      await refreshUser();
      router.push(getDashboardPath(data.data?.role || data.role));
    } catch { setError('An error occurred.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Left – Form */}
        <div className="flex-1 p-8 lg:p-12">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
              <ShoppingBag className="text-white" style={{ width: 15, height: 15 }} />
            </div>
            <span className="font-bold text-gray-900">MarketBridge</span>
          </Link>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500 mb-7">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 15, height: 15 }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com" autoComplete="email"
                  className="w-full pl-10 pr-4 h-11 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Password</label>
                <Link href="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 15, height: 15 }} />
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Enter your password" autoComplete="current-password"
                  className="w-full pl-10 pr-10 h-11 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPw ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 shadow-lg shadow-blue-100 mt-2"
              style={{ background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)' }}>
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or continue with</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Google', icon: '🔵' },
              { label: 'Apple', icon: '🍎' },
            ].map(p => (
              <button key={p.label} className="h-11 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                <span>{p.icon}</span> {p.label}
              </button>
            ))}
          </div>

          {/* Demo quick-login */}
          <div className="mt-5 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Quick Demo Login</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Customer', email: 'customer@demo.com' },
                { label: 'Warehouse', email: 'warehouse@demo.com' },
                { label: 'Admin', email: 'admin@demo.com' },
              ].map(d => (
                <button key={d.label} onClick={() => quickLogin(d.email, 'demo123')}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-white hover:border-blue-300 hover:text-blue-600 transition-all">
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-center text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors">Sign up free</Link>
          </p>
        </div>

        {/* Right – Image */}
        <div className="hidden lg:flex flex-1 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
          <img src="https://images.pexels.com/photos/5632394/pexels-photo-5632394.jpeg?w=800"
            alt="Shopping" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="relative z-10 flex flex-col justify-center p-10 text-white">
            <h2 className="text-2xl font-extrabold mb-2">Shop Smarter.</h2>
            <p className="text-blue-200 text-sm mb-8">Access thousands of products from verified sellers across Ethiopia.</p>
            <div className="space-y-4">
              {[
                { icon: ShieldCheck, t: 'Secure Payments', s: '256-bit SSL encryption' },
                { icon: Truck, t: 'Fast Delivery', s: 'Nationwide shipping' },
                { icon: RotateCcw, t: 'Easy Returns', s: '30-day return policy' },
                { icon: Headphones, t: '24/7 Support', s: 'Always here to help' },
              ].map(b => {
                const Icon = b.icon;
                return (
                  <div key={b.t} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon style={{ width: 16, height: 16 }} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{b.t}</p>
                      <p className="text-xs text-blue-200">{b.s}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
