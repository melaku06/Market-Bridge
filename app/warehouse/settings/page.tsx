'use client';

import { useState } from 'react';
import { Settings, Globe, Shield, Save } from 'lucide-react';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} type="button"
      style={{ width: 40, height: 22, background: on ? '#7c3aed' : '#e5e7eb', borderRadius: 20, position: 'relative', transition: 'background 0.2s', border: 'none', cursor: 'pointer' }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
    </button>
  );
}

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({ newOrders: true, lowStock: true, payments: false, promotions: false });
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC+3');
  const [twoFA, setTwoFA] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 1000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure your warehouse preferences</p>
      </div>

      <div className="max-w-2xl space-y-5">
        {/* Notification Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
              <Settings className="text-purple-500" style={{ width: 14, height: 14 }} />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
          </div>
          <div className="p-5 space-y-4">
            {[
              { key: 'newOrders', label: 'New Orders', desc: 'Get notified when a new order arrives' },
              { key: 'lowStock', label: 'Low Stock Alerts', desc: 'Alert when inventory falls below threshold' },
              { key: 'payments', label: 'Payment Updates', desc: 'Notifications for payment events' },
              { key: 'promotions', label: 'Promotions', desc: 'Updates about active promotions' },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800">{n.label}</p>
                  <p className="text-xs text-gray-400">{n.desc}</p>
                </div>
                <Toggle on={notifs[n.key as keyof typeof notifs]} onToggle={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof notifs] }))} />
              </div>
            ))}
          </div>
        </div>

        {/* Regional */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Globe className="text-blue-500" style={{ width: 14, height: 14 }} />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Regional</h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Language</label>
              <select value={language} onChange={e => setLanguage(e.target.value)}
                className="w-full px-3 h-10 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white cursor-pointer">
                <option value="en">English</option>
                <option value="am">Amharic</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Timezone</label>
              <select value={timezone} onChange={e => setTimezone(e.target.value)}
                className="w-full px-3 h-10 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white cursor-pointer">
                <option value="UTC+3">UTC+3 (Addis Ababa)</option>
                <option value="UTC+0">UTC+0 (London)</option>
                <option value="UTC-5">UTC-5 (New York)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-50">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Shield className="text-emerald-500" style={{ width: 14, height: 14 }} />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Security</h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Two-Factor Authentication</p>
                <p className="text-xs text-gray-400">Add an extra layer of security</p>
              </div>
              <Toggle on={twoFA} onToggle={() => setTwoFA(p => !p)} />
            </div>
            <button className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors">
              Change Password →
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-sm"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
            <Save style={{ width: 15, height: 15 }} />
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
