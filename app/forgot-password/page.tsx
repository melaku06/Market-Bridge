'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle, ArrowLeft, ShoppingBag, MessageCircle, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [telegramUsername, setTelegramUsername] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'request' | 'reset' | 'done'>('request');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegram_username: telegramUsername }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send reset code');
      }
      setStep('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_username: telegramUsername,
          reset_code: resetCode,
          new_password: newPassword,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to reset password');
      }
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
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
            {step === 'done' ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 ring-4 ring-emerald-100">
                  <CheckCircle className="w-10 h-10 text-emerald-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h1>
                <p className="text-gray-500 text-sm mb-8">
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
                <Link href="/login">
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm">
                    Back to Login
                  </button>
                </Link>
              </div>
            ) : step === 'reset' ? (
              <>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <KeyRound className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Enter Reset Code</h1>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  We&apos;ve sent a 6-digit reset code to your Telegram account <span className="font-semibold text-gray-700">@{telegramUsername}</span>. Enter it below along with your new password.
                </p>

                <form onSubmit={handleReset} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Reset Code</label>
                    <input
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white tracking-widest text-center font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Resetting...</>
                    ) : (
                      <><KeyRound className="w-4 h-4" /> Reset Password</>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep('request')}
                    className="w-full py-2.5 mt-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <MessageCircle className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Your Password?</h1>
                <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                  Enter your registered Telegram username and we&apos;ll send a reset code directly to your Telegram account.
                </p>

                <form onSubmit={handleRequest} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Telegram Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">@</span>
                      <input
                        type="text"
                        placeholder="your_telegram_username"
                        value={telegramUsername}
                        onChange={(e) => setTelegramUsername(e.target.value.replace(/^@/, ''))}
                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    {loading ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Reset Code</>
                    )}
                  </button>

                  <Link href="/login" className="flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Login
                  </Link>
                </form>

                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-semibold text-blue-700 mb-1.5">How it works</p>
                  <ol className="text-xs text-blue-600 space-y-1">
                    <li>1. Enter your registered Telegram username</li>
                    <li>2. We send a 6-digit code to your Telegram</li>
                    <li>3. Enter the code and set a new password</li>
                  </ol>
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
          {/* Telegram illustration */}
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="w-full h-full rounded-3xl bg-blue-100 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-40 h-40">
                <circle cx="100" cy="100" r="70" fill="#3B82F6" />
                <path d="M70 105 L140 75 L125 140 L105 125 L90 140 Z" fill="white" />
                <path d="M70 105 L125 140 L105 125 Z" fill="#E0E7FF" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">Reset via Telegram</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            Password recovery is handled through Telegram. Make sure your account is linked to your Telegram username in your profile settings.
          </p>

          <div className="bg-white rounded-2xl p-5 text-left shadow-sm border border-blue-100">
            <p className="text-sm font-semibold text-gray-900 mb-2">Don&apos;t have Telegram linked?</p>
            <p className="text-xs text-gray-500">
              Contact your administrator to link your Telegram account to your MarketBridge profile for password recovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
