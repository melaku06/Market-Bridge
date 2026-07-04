'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Shield, Truck, RotateCcw, Clock, Star } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { getDashboardPath } from '@/lib/auth/types';
import { SidebarIcon } from '@/components/ui/market-bridge-logo';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { user, isAuthenticated, refreshUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(getDashboardPath(user.role));
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated && user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Login failed');
        setIsLoading(false);
        return;
      }

      await refreshUser();

      if (data.user) {
        router.push(getDashboardPath(data.user.role));
      }
    } catch {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const quickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Form */}
      <div className="w-full lg:w-[480px] flex flex-col bg-white flex-shrink-0">
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <SidebarIcon />
              <span className="font-bold text-gray-900 text-lg tracking-tight">MarketBridge</span>
            </Link>
            <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back!</h1>
            <p className="text-gray-500 text-sm mb-8">Login to your account and continue shopping.</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all bg-gray-50 focus:bg-white pr-11"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1.5">
                  <Link href="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : 'Sign In'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">Create Account</Link>
              </p>
            </form>

            {/* Demo accounts */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Demo Login</p>
              <div className="space-y-2">
                {[
                  { role: 'Customer', email: 'customer@demo.com', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                  { role: 'Warehouse', email: 'warehouse@demo.com', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
                  { role: 'Admin', email: 'admin@demo.com', color: 'text-purple-600 bg-purple-50 border-purple-200' },
                ].map((demo) => (
                  <button
                    key={demo.role}
                    type="button"
                    onClick={() => quickLogin(demo.email)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors hover:opacity-80 ${demo.color}`}
                  >
                    <span className="font-semibold">{demo.role}:</span> {demo.email}
                  </button>
                ))}
                <p className="text-[10px] text-gray-400 text-center">All use password: demo123</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-800 via-indigo-700 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/3 rounded-full" />
        </div>

        {/* Product image overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Quality Products"
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center backdrop-blur-sm ring-1 ring-white/20">
              <svg viewBox="0 0 28 28" className="w-10 h-10" fill="none">
                <rect x="3" y="3" width="10" height="10" rx="2" fill="white" opacity="0.95"/>
                <rect x="15" y="3" width="10" height="10" rx="2" fill="white" opacity="0.6"/>
                <rect x="3" y="15" width="10" height="10" rx="2" fill="white" opacity="0.6"/>
                <rect x="15" y="15" width="10" height="10" rx="2" fill="white" opacity="0.95"/>
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Quality Products<br />Delivered to You</h2>
          <p className="text-indigo-200 text-sm mb-10 leading-relaxed">
            Join thousands of happy customers shopping with confidence from trusted warehouses.
          </p>
          <div className="space-y-3 text-left max-w-xs mx-auto">
            {[
              { icon: Shield, text: 'Secure & Protected Payments' },
              { icon: Truck, text: 'Fast & Reliable Delivery' },
              { icon: RotateCcw, text: 'Hassle-Free 30-Day Returns' },
              { icon: Clock, text: '24/7 Customer Support' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm ring-1 ring-white/10">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">{item.text}</span>
                </div>
              );
            })}
          </div>

          {/* Rating card */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-left ring-1 ring-white/15">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              ))}
            </div>
            <p className="text-white text-sm font-medium">&ldquo;Amazing selection and fast delivery!&rdquo;</p>
            <p className="text-indigo-300 text-xs mt-1">— Sarah M., Verified Customer</p>
          </div>
        </div>
      </div>
    </div>
  );
}
