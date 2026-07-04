'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Eye, EyeOff, Shield, Smartphone, Monitor, LogOut, CheckCircle, Lock, KeyRound, AlertTriangle } from 'lucide-react';

export default function SecurityPage() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);

  const sessions = [
    { device: 'Chrome on Windows', location: 'New York, USA', time: 'Current Session', current: true, icon: <Monitor className="w-4 h-4" /> },
    { device: 'Safari on iPhone 14', location: 'Los Angeles, USA', time: 'May 18, 2024 at 9:30 AM', current: false, icon: <Smartphone className="w-4 h-4" /> },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 1000);
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium">Account Security</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Account Security</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your password and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Change Password */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-gray-900">Change Password</h2>
          </div>
          <p className="text-sm text-gray-500 mb-5">Update your password to keep your account secure.</p>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
              <div className="relative">
                <input type={showCurrent ? 'text' : 'password'} defaultValue="••••••••" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all pr-10 bg-gray-50 focus:bg-white" />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} placeholder="Create new password" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all pr-10 bg-gray-50 focus:bg-white" />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} placeholder="Confirm new password" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all pr-10 bg-gray-50 focus:bg-white" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-600/20">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
              {saved ? 'Password Updated' : saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          {/* 2FA */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${twoFAEnabled ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                  {twoFAEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <button onClick={() => setTwoFAEnabled(!twoFAEnabled)} className="text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                  {twoFAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                </button>
              </div>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-gray-900 text-sm">Active Sessions</p>
              <p className="text-xs text-gray-500">You are currently signed in on these devices.</p>
            </div>
            <div className="space-y-3">
              {sessions.map((session, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    {session.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{session.device}</p>
                    <p className="text-xs text-gray-500">{session.location} • {session.time}</p>
                  </div>
                  {session.current ? (
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium ring-1 ring-emerald-200">This Device</span>
                  ) : (
                    <button className="text-xs text-red-600 hover:text-red-700 font-medium border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                      Sign Out
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button className="mt-3 w-full text-sm text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-1.5 py-2 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign out from all other devices
            </button>
          </div>
        </div>

        {/* Security Tips */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="font-bold text-gray-900 text-sm">Keep Your Account Secure</p>
            </div>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {[
                'Use a strong password and don\'t share it with anyone.',
                'Enable Two-Factor Authentication for extra security.',
                'Review your active sessions regularly.',
                'Update your password every 90 days.',
                'Use a unique password for this account.',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="font-semibold text-amber-900 text-sm">Security Alert</p>
            </div>
            <p className="text-xs text-amber-700 leading-relaxed">
              If you notice any suspicious activity on your account, please change your password immediately and contact our support team.
            </p>
            <button className="mt-3 text-xs font-semibold text-amber-700 hover:text-amber-800 underline">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
