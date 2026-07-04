'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronRight, Eye, EyeOff, Shield, Smartphone, Monitor, LogOut, CheckCircle, Lock, KeyRound, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth/auth-store';

export default function SecurityPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const reset = useAuthStore((s) => s.reset);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to change password');
      }

      setSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    reset();
    router.push('/');
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight style={{ width: 12, height: 12 }} />
          <span className="text-gray-700 font-medium">Account Security</span>
        </div>
        <h1 className="text-lg font-bold text-gray-900">Account Security</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Manage your password and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-0.5">
            <Lock style={{ width: 14, height: 14 }} className="text-blue-600" />
            <h2 className="text-[13px] font-bold text-gray-900">Change Password</h2>
          </div>
          <p className="text-[12px] text-gray-500 mb-4">Update your password to keep your account secure.</p>

          <form onSubmit={handleSave} className="space-y-3">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:border-blue-500 focus:outline-none transition-all pr-10 bg-gray-50 focus:bg-white"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCurrent ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create new password"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:border-blue-500 focus:outline-none transition-all pr-10 bg-gray-50 focus:bg-white"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNew ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:border-blue-500 focus:outline-none transition-all pr-10 bg-gray-50 focus:bg-white"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold text-[13px] transition-colors">
              {saving && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {!saving && saved && <CheckCircle style={{ width: 14, height: 14 }} />}
              {!saving && !saved && <KeyRound style={{ width: 14, height: 14 }} />}
              {saved ? 'Password Updated' : saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-gray-900">Sign Out</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Sign out of your current session.</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[12px] text-red-600 hover:text-red-700 font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut style={{ width: 14, height: 14 }} />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Shield style={{ width: 18, height: 18 }} className="text-emerald-600" />
              </div>
              <p className="text-[13px] font-bold text-gray-900">Keep Your Account Secure</p>
            </div>
            <ul className="space-y-2 text-[12px] text-gray-600">
              {[
                'Use a strong password and don\'t share it with anyone.',
                'Update your password regularly.',
                'Review your account activity periodically.',
                'Use a unique password for this account.',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle style={{ width: 14, height: 14 }} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle style={{ width: 16, height: 16 }} className="text-amber-600" />
              <p className="text-[13px] font-semibold text-amber-900">Security Alert</p>
            </div>
            <p className="text-[12px] text-amber-700 leading-relaxed">
              If you notice any suspicious activity on your account, please change your password immediately and contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
