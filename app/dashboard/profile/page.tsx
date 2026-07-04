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
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium">Profile Settings</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Profile Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Avatar Panel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-50">
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors ring-2 ring-white">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="font-bold text-gray-900">{form.name}</p>
          <p className="text-xs text-gray-500 mb-1">{form.email}</p>
          <span className="inline-block text-xs px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium mb-3">Customer</span>
          <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
            Change Photo
          </button>
          <p className="text-xs text-gray-400 mt-3">JPG, PNG or GIF. Max 2MB.</p>
        </div>

        {/* Form */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-1">Profile Information</h2>
          <p className="text-sm text-gray-500 mb-5">Update your personal details and how we can contact you.</p>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" /> Full Name
                </label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" /> Email Address
                </label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" /> Phone Number
                </label>
                <input type="tel" value={form.phone} readOnly className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" /> Date of Birth
                </label>
                <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white">
                  <option>Female</option><option>Male</option><option>Other</option><option>Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5">
              <h3 className="font-semibold text-gray-900 mb-4">Preferences</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-gray-400" /> Language
                  </label>
                  <select value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-white">
                    <option>English</option><option>Arabic</option><option>French</option><option>Spanish</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-gray-400" /> Currency
                  </label>
                  <div className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-700">
                    ETB - Ethiopian Birr
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 mt-4 cursor-pointer p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <input type="checkbox" checked={form.newsletter} onChange={(e) => setForm({ ...form, newsletter: e.target.checked })} className="w-4 h-4 accent-blue-600 rounded" />
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm text-gray-600">I would like to receive emails about new products, offers and updates.</span>
                </div>
              </label>
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-600/20"
              >
                {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
