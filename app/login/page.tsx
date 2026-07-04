'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Shield, Truck, RotateCcw, Clock, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '@/stores/auth/auth-store';
import { getDashboardPath } from '@/lib/auth/types';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const fromPath = searchParams.get('from');

  useEffect(() => {
    if (user) {
      router.push(fromPath || getDashboardPath(user.role));
    }
  }, [user, router, fromPath]);

  if (user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success && result.user) {
        router.push(fromPath || getDashboardPath(result.user.role));
      } else {
        setError(result.error || 'Login failed');
        setIsLoading(false);
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
        <div className="px-8 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
                <ShoppingBag className="text-white" style={{ width: 18, height: 18 }} />
              </div>
              <span className="font-bold text-gray-900 text-sm tracking-tight">MarketBridge</span>
            </Link>
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Back to Home
            </Link>
          </div>
        </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email or Phone</label>
                <input
                  type="email"
                  placeholder="Enter your email or phone number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white pr-11"
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
                  <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                ) : 'Login'}
              </button>

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
              </div>

              <button
                type="button"
                className="w-full py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-3 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <button
                type="button"
                className="w-full py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-3 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Continue with Apple
              </button>

              <p className="text-center text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">Create Account</Link>
              </p>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Demo Login</p>
              <div className="space-y-2">
                {[
                  { role: 'Customer', email: 'customer@demo.com', color: 'text-blue-600 bg-blue-50 border-blue-200' },
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
      <div className="hidden lg:flex flex-1 flex-col relative overflow-hidden">
        {/* Image background */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Quality Products"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-800/70 to-blue-900/80" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-12">
          <div className="flex-1 flex flex-col justify-center max-w-md">
            <h2 className="text-3xl font-bold text-white mb-3">Quality Products<br />Delivered to You</h2>
            <p className="text-blue-200 text-sm mb-10 leading-relaxed">
              Join thousands of happy customers shopping with confidence.
            </p>
            <div className="space-y-3">
              {[
                { icon: Shield, text: 'Secure Payments' },
                { icon: Truck, text: 'Fast & Reliable Delivery' },
                { icon: RotateCcw, text: 'Easy Returns' },
                { icon: Clock, text: '24/7 Customer Support' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white text-sm font-medium">{item.text}</span>
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
