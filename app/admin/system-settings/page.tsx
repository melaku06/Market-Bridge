'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Save, Upload, Globe, CreditCard, Truck, Mail, Phone, Search, Database, Shield } from 'lucide-react';
import { useAdminStore } from '@/stores/admin/admin-store';

const sidebarTabs = [
  { key: 'general', label: 'General Settings', icon: Globe },
  { key: 'payment', label: 'Payment Settings', icon: CreditCard },
  { key: 'shipping', label: 'Shipping Settings', icon: Truck },
  { key: 'email', label: 'Email Settings', icon: Mail },
  { key: 'sms', label: 'SMS Settings', icon: Phone },
  { key: 'seo', label: 'SEO Settings', icon: Search },
  { key: 'maintenance', label: 'Maintenance Mode', icon: Shield },
  { key: 'api', label: 'API Settings', icon: Database },
  { key: 'backup', label: 'Backup & Restore', icon: Database },
];

export default function AdminSystemSettings() {
  const { systemSettings, isLoading, fetchSystemSettings, updateSystemSettings } = useAdminStore();
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({ telebirr: true, cbe: true, mpesa: false, cod: true });
  const [settings, setSettings] = useState({
    site_name: 'MarketBridge',
    site_tagline: 'Bridging Markets, Building Trust',
    site_email: 'support@marketbridge.com',
    site_phone: '+1(850) 123-4567' as string | null,
    currency: 'USD - US Dollar',
    timezone: '(UTC -05:00) Eastern Time (US & Canada)',
    date_format: 'May 31, 2024',
    time_format: '12 Hour (AM/PM)',
    items_per_page: 10,
    site_language: 'English',
    site_status: 'active' as 'active' | 'maintenance',
    maintenance_mode: false,
  });

  useEffect(() => {
    fetchSystemSettings();
  }, [fetchSystemSettings]);

  useEffect(() => {
    if (systemSettings) {
      setSettings(prev => ({ ...prev, ...systemSettings }));
    }
  }, [systemSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSystemSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">System Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Configure general settings for the platform.</p>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Left sidebar */}
        <div className="w-52 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 p-2 space-y-0.5">
            {sidebarTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors text-left ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Icon className={activeTab === tab.key ? 'text-white' : 'text-gray-400'} style={{ width: 14, height: 14 }} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="text-sm font-bold text-gray-900 mb-4">General Settings</h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {/* Left column */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-3">Site Configuration</h3>
                      <div className="space-y-3">
                        {[
                          { label: 'Site Name', key: 'site_name' },
                          { label: 'Site Tagline', key: 'site_tagline' },
                          { label: 'Default Currency', key: 'currency', isSelect: true, options: ['USD - US Dollar', 'EUR - Euro', 'GBP - British Pound', 'ETB - Ethiopian Birr'] },
                          { label: 'Timezone', key: 'timezone', isSelect: true, options: ['(UTC -05:00) Eastern Time (US & Canada)', '(UTC +00:00) UTC', '(UTC +03:00) East Africa Time'] },
                          { label: 'Date Format', key: 'date_format', isSelect: true, options: ['May 31, 2024', '31/05/2024', '05/31/2024'] },
                          { label: 'Items Per Page', key: 'items_per_page' },
                        ].map(field => (
                          <div key={field.key}>
                            <label className="block text-[11px] font-semibold text-gray-500 mb-1">{field.label}</label>
                            {field.isSelect ? (
                              <select value={(settings as any)[field.key]} onChange={e => setSettings({ ...settings, [field.key]: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400 bg-white">
                                {field.options?.map(o => <option key={o}>{o}</option>)}
                              </select>
                            ) : (
                              <input type={field.key === 'items_per_page' ? 'number' : 'text'} value={(settings as any)[field.key]} onChange={e => setSettings({ ...settings, [field.key]: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Right column */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-3">Site Logo</h3>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl mx-auto mb-2 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">MB</span>
                        </div>
                        <p className="text-[12px] font-semibold text-gray-700 mb-1">MarketBridge</p>
                        <button className="text-[12px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 mx-auto">
                          <Upload style={{ width: 12, height: 12 }} /> Change Logo
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {[
                        { label: 'Site Email', key: 'site_email' },
                        { label: 'Site Phone', key: 'site_phone' },
                        { label: 'Time Format', key: 'time_format', isSelect: true, options: ['12 Hour (AM/PM)', '24 Hour'] },
                        { label: 'Site Language', key: 'site_language', isSelect: true, options: ['English', 'Amharic', 'French', 'Spanish'] },
                      ].map(field => (
                        <div key={field.key}>
                          <label className="block text-[11px] font-semibold text-gray-500 mb-1">{field.label}</label>
                          {field.isSelect ? (
                            <select value={(settings as any)[field.key]} onChange={e => setSettings({ ...settings, [field.key]: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400 bg-white">
                              {field.options?.map(o => <option key={o}>{o}</option>)}
                            </select>
                          ) : (
                            <input type="text" value={(settings as any)[field.key]} onChange={e => setSettings({ ...settings, [field.key]: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400" />
                          )}
                        </div>
                      ))}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-500 mb-1">Site Status</label>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setMaintenanceMode(!maintenanceMode)} className={`relative w-10 h-5 rounded-full transition-colors ${!maintenanceMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${!maintenanceMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                          </button>
                          <span className="text-[12px] font-medium text-emerald-600">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-5 border-t border-gray-100">
                  <button onClick={handleSave} disabled={saving} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors ${saved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} disabled:opacity-60`}>
                    <Save style={{ width: 14, height: 14 }} />
                    {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Payment Settings</h2>
              <div className="space-y-3">
                {([
                  { name: 'Telebirr', desc: 'Ethiopian mobile payment', key: 'telebirr' as const },
                  { name: 'CBE Birr', desc: 'Commercial Bank of Ethiopia', key: 'cbe' as const },
                  { name: 'M-PESA', desc: 'Mobile money transfer', key: 'mpesa' as const },
                  { name: 'Cash on Delivery', desc: 'Pay when delivered', key: 'cod' as const },
                ] as const).map(method => (
                  <div key={method.key} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="text-[13px] font-semibold text-gray-900">{method.name}</p>
                      <p className="text-[11px] text-gray-400">{method.desc}</p>
                    </div>
                    <button onClick={() => setPaymentMethods(prev => ({ ...prev, [method.key]: !prev[method.key] }))} className={`relative w-10 h-5 rounded-full transition-colors ${paymentMethods[method.key] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${paymentMethods[method.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Shipping Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Free Shipping Threshold ($)</label>
                  <input type="number" defaultValue={50} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-gray-700 mb-1">Standard Shipping Fee ($)</label>
                  <input type="number" defaultValue={4.99} step="0.01" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400" />
                </div>
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition-colors">
                  <Save style={{ width: 14, height: 14 }} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4">Email Settings</h2>
              <div className="space-y-4">
                {[
                  { label: 'SMTP Host', placeholder: 'smtp.example.com' },
                  { label: 'SMTP Port', placeholder: '587' },
                  { label: 'Encryption', placeholder: 'TLS' },
                  { label: 'From Email', placeholder: 'noreply@marketbridge.com' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-[12px] font-semibold text-gray-700 mb-1">{field.label}</label>
                    <input type="text" placeholder={field.placeholder} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400" />
                  </div>
                ))}
                <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition-colors">
                  <Save style={{ width: 14, height: 14 }} /> Save Changes
                </button>
              </div>
            </div>
          )}

          {['sms', 'seo', 'maintenance', 'api', 'backup'].includes(activeTab) && (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <Shield className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-[13px] font-semibold text-gray-500">{sidebarTabs.find(t => t.key === activeTab)?.label}</p>
              <p className="text-[12px] text-gray-400 mt-1">Configuration coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
