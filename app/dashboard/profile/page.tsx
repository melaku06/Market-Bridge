'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Camera, Save, User, Mail, Phone, Calendar, Globe, DollarSign, Bell, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+251 91 234 5678',
    dob: '1992-05-12',
    gender: 'Female',
    language: 'English',
    currency: 'ETB - Ethiopian Birr',
    newsletter: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 1000);
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb + Header */}
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
        {/* Avatar Panel */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-50">
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors border-2 border-white">
              <Camera style={{ width: 12, height: 12 }} className="text-white" />
            </button>
          </div>
          <p className="text-[13px] font-bold text-gray-900">{form.name}</p>
          <p className="text-[11px] text-gray-500 mb-1">{form.email}</p>
          <span className="inline-block text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium mb-3">Customer</span>
          <button className="w-full text-[12px] text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Change Photo
          </button>
          <p className="text-[11px] text-gray-400 mt-2">JPG, PNG or GIF. Max 2MB.</p>
        </div>

        {/* Form */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-[13px] font-bold text-gray-900 mb-0.5">Profile Information</h2>
          <p className="text-[12px] text-gray-500 mb-4">Update your personal details and how we can contact you.</p>

          <form onSubmit={handleSave} className="space-y-4">
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
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:border-blue-500 focus:outline-none transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Phone style={{ width: 12, height: 12 }} className="text-gray-400" /> Phone Number
                </label>
                <input type="tel" value={form.phone} readOnly className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                  <Calendar style={{ width: 12, height: 12 }} className="text-gray-400" /> Date of Birth
                </label>
                <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:border-blue-500 focus:outline-none transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">Gender</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:border-blue-500 focus:outline-none transition-all bg-white">
                  <option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-[13px] font-semibold text-gray-900 mb-3">Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <Globe style={{ width: 12, height: 12 }} className="text-gray-400" /> Language
                  </label>
                  <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:border-blue-500 focus:outline-none transition-all bg-white">
                    <option>English</option><option>Arabic</option><option>French</option><option>Spanish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-gray-700 mb-1 flex items-center gap-1.5">
                    <DollarSign style={{ width: 12, height: 12 }} className="text-gray-400" /> Currency
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] bg-gray-50 text-gray-700">
                    ETB - Ethiopian Birr
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 mt-3 cursor-pointer p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={form.newsletter} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} className="w-4 h-4 accent-blue-600 rounded" />
                <div className="flex items-center gap-1.5">
                  <Bell style={{ width: 12, height: 12 }} className="text-gray-400" />
                  <span className="text-[12px] text-gray-600">I would like to receive emails about new products, offers and updates.</span>
                </div>
              </label>
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
