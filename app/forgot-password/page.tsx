'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Mail, Phone, CheckCircle, ArrowLeft, Send } from 'lucide-react';

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
      <div className="w-full lg:w-[480px] flex flex-col bg-white flex-shrink-0">
        {/* Header */}
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
                <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 ring-4 ring-emerald-100">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Sent!</h1>
                <p className="text-gray-500 text-sm mb-2">
                  We've sent a password reset link to
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
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-7 h-7 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password?</h1>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  No worries! Enter your email and we'll send you a secure link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    Reset via Phone Number
                  </button>

                  <Link href="/login" className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          {/* Animated mail icon */}
          <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Mail className="w-14 h-14 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">Password Recovery</h2>
          <p className="text-blue-100 text-sm mb-8 leading-relaxed">
            We'll send you a secure link to reset your password. Check your inbox and follow the instructions.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left">
            <p className="font-semibold text-white text-sm mb-4">Need immediate help?</p>
            <div className="space-y-3">
              <a href="mailto:support@marketbridge.com" className="flex items-center gap-3 text-sm text-blue-100 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                support@marketbridge.com
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-3 text-sm text-blue-100 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
