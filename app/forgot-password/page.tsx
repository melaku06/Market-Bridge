'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Mail, Phone, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSent(true); }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="px-8 py-5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-lg">MarketBridge</span>
            </Link>
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Back to Login</Link>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            {sent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Check Your Email</h1>
                <p className="text-gray-500 text-sm mb-6">
                  We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
                </p>
                <Link href="/login">
                  <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors">
                    Back to Login
                  </button>
                </Link>
                <p className="text-xs text-gray-400 mt-4">
                  Didn't receive the email? Check your spam folder or{' '}
                  <button onClick={() => setSent(false)} className="text-blue-600 hover:underline">try again</button>
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Your Password?</h1>
                <p className="text-gray-500 text-sm mb-8">
                  No worries! Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</> : 'Send Reset Link'}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                    <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400">or</span></div>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Reset via Phone
                  </button>

                  <Link href="/login">
                    <button type="button" className="w-full py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                      Back to Login
                    </button>
                  </Link>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-50 to-blue-100 items-center justify-center p-16 relative overflow-hidden">
        <div className="text-center max-w-md">
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 bg-blue-600/20 rounded-full animate-ping" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 bg-white rounded-full shadow-xl flex items-center justify-center">
                <Mail className="w-14 h-14 text-blue-600" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Forgot Your Password?</h2>
          <p className="text-gray-500 text-sm mb-8">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-sm text-left space-y-3">
            <p className="font-semibold text-gray-900 text-sm">Need help?</p>
            <p className="text-sm text-gray-500">Contact our support team at</p>
            <a href="mailto:support@marketbridge.com" className="block text-sm text-blue-600 hover:underline">support@marketbridge.com</a>
            <p className="text-sm text-gray-500">or call</p>
            <a href="tel:+15551234567" className="text-sm text-blue-600 hover:underline">+1 (555) 123-4567</a>
          </div>
        </div>

        {/* Decorative mailbox */}
        <div className="absolute bottom-10 right-10 opacity-20">
          <div className="w-32 h-32 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Mail className="w-16 h-16 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
