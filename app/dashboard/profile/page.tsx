'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Camera, Save, User, Mail, Phone, CheckCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth/auth-store';

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: form.name, phone: form.phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      const data = await res.json();
      setUser(data.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight style={{ width: 12, height: 12 }} />
          <span className="text-gray-700 font-medium">Profile Settings</span>
        </div>
        <h1 className="text-lg font-bold text-gray-900">Profile Settings</h1>
        <p className="text-[13px] text-gray-500 mt-0.5">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-50 bg-gray-100 flex items-center justify-center">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors border-2 border-white">
              <Camera style={{ width: 12, height: 12 }} className="text-white" />
            </button>
          </div>
          <p className="text-[13px] font-bold text-gray-900">{form.name || 'User'}</p>
          <p className="text-[11px] text-gray-500 mb-1">{form.email}</p>
          <span className="inline-block text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium mb-3 capitalize">{user?.role || 'Customer'}</span>
          <p className="text-[11px] text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
        </div>

        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-[13px] font-bold text-gray-900 mb-0.5">Profile Information</h2>
          <p className="text-[12px] text-gray-500 mb-4">Update your personal details and how we can contact you.</p>

          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <User style={{ width: 12, height: 12 }} className="text-gray-400" /> Full Name
                </label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:border-blue-500 focus:outline-none transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Mail style={{ width: 12, height: 12 }} className="text-gray-400" /> Email Address
                </label>
                <input type="email" value={form.email} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Phone style={{ width: 12, height: 12 }} className="text-gray-400" /> Phone Number
                </label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:border-blue-500 focus:outline-none transition-all bg-gray-50 focus:bg-white" />
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-semibold text-[13px] transition-colors"
              >
                {saving && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {!saving && saved && <CheckCircle style={{ width: 14, height: 14 }} />}
                {!saving && !saved && <Save style={{ width: 14, height: 14 }} />}
                {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
