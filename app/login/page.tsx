'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ShoppingBag, Shield, Truck, RotateCcw, Clock } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getDashboardPath } from '@/lib/auth/types';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();

  // Redirect if already authenticated
  if (isAuthenticated && user) {
    router.push(getDashboardPath(user.role));
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login(email, password);
    if (success && user) {
      router.push(getDashboardPath(user.role));
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">MarketBridge</span>
            </Link>
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back!</h1>
            <p className="text-gray-500 text-sm mb-8">Login to your account and continue shopping.</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
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
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-end mt-1">
                  <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700">Forgot Password?</Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Logging in...</>
                ) : 'Login'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">Create Account</Link>
              </p>
            </form>

            {/* Demo accounts */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs font-semibold text-gray-500 mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-xs text-gray-600">
                <p><span className="font-medium">Customer:</span> customer@demo.com / demo123</p>
                <p><span className="font-medium">Warehouse:</span> warehouse@demo.com / demo123</p>
                <p><span className="font-medium">Admin:</span> admin@demo.com / demo123</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full" />
          <div className="absolute bottom-20 right-20 w-56 h-56 bg-white rounded-full" />
        </div>
        <div className="relative z-10 text-center max-w-md">
          <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Quality Products<br />Delivered to You</h2>
          <p className="text-blue-200 mb-10">Join thousands of happy customers shopping with confidence.</p>
          <div className="space-y-4 text-left">
            {[
              { icon: <Shield className="w-5 h-5 text-blue-300" />, text: 'Secure Payments' },
              { icon: <Truck className="w-5 h-5 text-blue-300" />, text: 'Fast & Reliable Delivery' },
              { icon: <RotateCcw className="w-5 h-5 text-blue-300" />, text: 'Easy Returns' },
              { icon: <Clock className="w-5 h-5 text-blue-300" />, text: '24/7 Customer Support' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">{item.icon}</div>
                <span className="text-white font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
