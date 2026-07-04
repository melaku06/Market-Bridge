'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, User, Building2, Shield, Check, Star, Package, TrendingUp } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import type { UserRole } from '@/lib/auth/types';
import { getDashboardPath } from '@/lib/auth/types';
import { SidebarIcon } from '@/components/ui/market-bridge-logo';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'customer' as UserRole,
  });

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Registration failed');
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

  const roleOptions = [
    {
      value: 'customer' as UserRole,
      label: 'Customer',
      description: 'Browse and shop products',
      icon: User,
    },
    {
      value: 'warehouse' as UserRole,
      label: 'Warehouse',
      description: 'Sell products on the platform',
      icon: Building2,
    },
  ];

  const customerBenefits = [
    { icon: Package, text: 'Browse thousands of products' },
    { icon: Star, text: 'Save favorites to wishlist' },
    { icon: Shield, text: 'Secure & easy checkout' },
    { icon: TrendingUp, text: 'Track your orders in real time' },
  ];

  const warehouseBenefits = [
    { icon: Package, text: 'List and sell your products' },
    { icon: TrendingUp, text: 'Analytics and sales insights' },
    { icon: Shield, text: 'Secure & fast payouts' },
    { icon: Star, text: 'Build your brand reputation' },
  ];

  const benefits = formData.role === 'warehouse' ? warehouseBenefits : customerBenefits;

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
            <Link href="/" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center px-8 py-8 overflow-y-auto">
          <div className="w-full max-w-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Your Account</h1>
            <p className="text-gray-500 text-sm mb-6">Join MarketBridge and start shopping or selling.</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I want to</label>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.role === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, role: option.value })}
                        className={`relative p-3 border-2 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'border-violet-500 bg-violet-50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-violet-600' : 'text-gray-400'}`} />
                        <p className={`text-sm font-semibold ${isSelected ? 'text-violet-600' : 'text-gray-900'}`}>
                          {option.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all bg-gray-50 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all bg-gray-50 focus:bg-white pr-11"
                    minLength={6}
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all bg-gray-50 focus:bg-white ${
                    formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-gray-200 focus:border-violet-500 focus:ring-violet-500/20'
                  }`}
                  required
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1.5">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || (formData.confirmPassword !== '' && formData.password !== formData.confirmPassword)}
                className="w-full py-3 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                {isLoading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
                ) : 'Create Account'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="text-violet-600 hover:text-violet-700 font-semibold">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-violet-800 via-violet-700 to-purple-700 items-center justify-center p-12 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-white/5 rounded-full" />
        </div>
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Join MarketBridge"
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center backdrop-blur-sm ring-1 ring-white/20">
              {formData.role === 'warehouse' ? (
                <Building2 className="w-10 h-10 text-white" />
              ) : (
                <svg viewBox="0 0 28 28" className="w-10 h-10" fill="none">
                  <rect x="3" y="3" width="10" height="10" rx="2" fill="white" opacity="0.95"/>
                  <rect x="15" y="3" width="10" height="10" rx="2" fill="white" opacity="0.6"/>
                  <rect x="3" y="15" width="10" height="10" rx="2" fill="white" opacity="0.6"/>
                  <rect x="15" y="15" width="10" height="10" rx="2" fill="white" opacity="0.95"/>
                </svg>
              )}
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            {formData.role === 'warehouse' ? 'Grow Your Business' : 'Shop Everything You Need'}
          </h2>
          <p className="text-violet-200 text-sm mb-8 leading-relaxed">
            {formData.role === 'warehouse'
              ? 'Join hundreds of warehouses already selling on MarketBridge and grow your revenue.'
              : 'Access thousands of quality products from verified warehouses at the best prices.'}
          </p>

          <div className="space-y-3 text-left max-w-xs mx-auto">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.text} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm ring-1 ring-white/10">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white text-sm font-medium">{benefit.text}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { value: '10K+', label: 'Products' },
              { value: '500+', label: 'Warehouses' },
              { value: '50K+', label: 'Customers' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl py-3 px-2 ring-1 ring-white/10">
                <p className="text-white font-bold text-lg">{stat.value}</p>
                <p className="text-indigo-300 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
