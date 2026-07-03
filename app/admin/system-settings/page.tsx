'use client';

import { useEffect, useState } from 'react';
import {
  Settings, Globe, CreditCard, Truck, Mail, MessageSquare, Search, Wrench,
  Save, ToggleLeft, ToggleRight, Image as ImageIcon, Clock, List, Languages,
} from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { SystemSettings } from '@/lib/types';

type Tab = 'general' | 'payment' | 'shipping' | 'email' | 'sms' | 'seo' | 'api' | 'backup';

const TABS: { key: Tab; label: string; icon: typeof Settings }[] = [
  { key: 'general', label: 'General Settings', icon: Settings },
  { key: 'payment', label: 'Payment Settings', icon: CreditCard },
  { key: 'shipping', label: 'Shipping Settings', icon: Truck },
  { key: 'email', label: 'Email Settings', icon: Mail },
  { key: 'sms', label: 'SMS Settings', icon: MessageSquare },
  { key: 'seo', label: 'SEO Settings', icon: Search },
  { key: 'api', label: 'API Settings', icon: Wrench },
  { key: 'backup', label: 'Backup & Restore', icon: Settings },
];

export default function SystemSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await adminApi.systemSettings.get();
        setSettings(data);
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await adminApi.systemSettings.update(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-500">Configure general settings for the platform.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === tab.key
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4 flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Panel */}
        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <>
              {/* Site Configuration */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  Site Configuration
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Name</label>
                      <input
                        type="text"
                        value={settings.site_name}
                        onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Tagline</label>
                      <input
                        type="text"
                        value={settings.site_tagline}
                        onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Email</label>
                      <input
                        type="email"
                        value={settings.site_email}
                        onChange={(e) => setSettings({ ...settings, site_email: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Phone</label>
                      <input
                        type="text"
                        value={settings.site_phone}
                        onChange={(e) => setSettings({ ...settings, site_phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Logo</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <span className="text-white font-bold text-sm">MB</span>
                        </div>
                        <p className="text-sm font-medium text-gray-700">MarketBridge</p>
                        <button className="mt-3 px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5 mx-auto">
                          <ImageIcon className="w-3.5 h-3.5" />
                          Change Logo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regional Settings */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  Regional Settings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Currency</label>
                    <div className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-700">
                      ETB - Ethiopian Birr
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                    <select
                      value={settings.timezone}
                      onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value="Africa/Addis_Ababa (UTC+3)">Africa/Addis Ababa (UTC+3)</option>
                      <option value="UTC">UTC</option>
                      <option value="Asia/Dubai (UTC+4)">Asia/Dubai (UTC+4)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date Format</label>
                    <select
                      value={settings.date_format}
                      onChange={(e) => setSettings({ ...settings, date_format: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Time Format</label>
                    <select
                      value={settings.time_format}
                      onChange={(e) => setSettings({ ...settings, time_format: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option value="12 Hour (AM/PM)">12 Hour (AM/PM)</option>
                      <option value="24 Hour">24 Hour</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Items Per Page</label>
                    <select
                      value={settings.items_per_page}
                      onChange={(e) => setSettings({ ...settings, items_per_page: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none bg-white"
                    >
                      {[10, 20, 25, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Site Language</label>
                    <select
                      value={settings.site_language}
                      onChange={(e) => setSettings({ ...settings, site_language: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none bg-white"
                    >
                      <option>English</option>
                      <option>Amharic</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Site Status */}
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-gray-400" />
                  Site Status
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Maintenance Mode</p>
                      <p className="text-sm text-gray-500">When enabled, only admins can access the site.</p>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, maintenance_mode: !settings.maintenance_mode })}
                      className="flex-shrink-0"
                    >
                      {settings.maintenance_mode
                        ? <ToggleRight className="w-10 h-10 text-blue-600" />
                        : <ToggleLeft className="w-10 h-10 text-gray-400" />
                      }
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">Site Status</p>
                      <p className="text-sm text-gray-500">Control whether the site is publicly accessible.</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      settings.site_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {settings.site_status === 'active' ? 'Active' : 'Maintenance'}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'payment' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-5">Payment Settings</h2>
              <div className="space-y-4">
                {[
                  { label: 'Telebirr', enabled: true, desc: 'Accept payments via Telebirr mobile money' },
                  { label: 'CBE Birr', enabled: true, desc: 'Accept payments via Commercial Bank of Ethiopia' },
                  { label: 'M-PESA', enabled: true, desc: 'Accept payments via M-PESA mobile money' },
                  { label: 'Cash on Delivery', enabled: true, desc: 'Allow customers to pay on delivery' },
                ].map((method) => (
                  <div key={method.label} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900">{method.label}</p>
                      <p className="text-sm text-gray-500">{method.desc}</p>
                    </div>
                    {method.enabled
                      ? <ToggleRight className="w-10 h-10 text-blue-600 flex-shrink-0" />
                      : <ToggleLeft className="w-10 h-10 text-gray-400 flex-shrink-0" />
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-5">Shipping Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Free Shipping Threshold</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue="5000"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">Br</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Orders above this amount get free shipping.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Standard Shipping Fee</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue="580"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">Br</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Express Shipping Fee</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      defaultValue="999"
                      className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                    />
                    <span className="text-sm text-gray-500 whitespace-nowrap">Br</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-5">Email Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Host</label>
                  <input type="text" defaultValue="smtp.marketbridge.com" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Port</label>
                    <input type="number" defaultValue="587" className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Encryption</label>
                    <select className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none bg-white">
                      <option>TLS</option>
                      <option>SSL</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">From Email</label>
                  <input type="email" value={settings.site_email} onChange={(e) => setSettings({ ...settings, site_email: e.target.value })} className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'sms' || activeTab === 'seo' || activeTab === 'api' || activeTab === 'backup') && (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-700 mb-2 capitalize">{TABS.find((t) => t.key === activeTab)?.label}</h3>
              <p className="text-sm text-gray-400">Configuration coming soon.</p>
            </div>
          )}

          {/* Save Button */}
          {activeTab !== 'sms' && activeTab !== 'seo' && activeTab !== 'api' && activeTab !== 'backup' && (
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                {saving
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Save className="w-4 h-4" />
                }
                {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
