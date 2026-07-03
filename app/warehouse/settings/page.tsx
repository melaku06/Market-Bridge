'use client';

import { useState } from 'react';
import { Save, Bell, Lock, Globe, Shield } from 'lucide-react';

export default function WarehouseSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    orderAlerts: true,
    stockAlerts: true,
    marketingEmails: false,
    language: 'en',
    timezone: 'Africa/Addis_Ababa',
    twoFactorAuth: false,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your warehouse settings</p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900">Notifications</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
              className="w-5 h-5 rounded text-blue-600"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Order Alerts</p>
              <p className="text-sm text-gray-500">Get notified when you receive new orders</p>
            </div>
            <input
              type="checkbox"
              checked={settings.orderAlerts}
              onChange={(e) => setSettings({ ...settings, orderAlerts: e.target.checked })}
              className="w-5 h-5 rounded text-blue-600"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Stock Alerts</p>
              <p className="text-sm text-gray-500">Get notified when inventory is running low</p>
            </div>
            <input
              type="checkbox"
              checked={settings.stockAlerts}
              onChange={(e) => setSettings({ ...settings, stockAlerts: e.target.checked })}
              className="w-5 h-5 rounded text-blue-600"
            />
          </label>
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Marketing Emails</p>
              <p className="text-sm text-gray-500">Receive promotional emails and updates</p>
            </div>
            <input
              type="checkbox"
              checked={settings.marketingEmails}
              onChange={(e) => setSettings({ ...settings, marketingEmails: e.target.checked })}
              className="w-5 h-5 rounded text-blue-600"
            />
          </label>
        </div>
      </div>

      {/* Regional */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900">Regional Settings</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Africa/Addis_Ababa">East Africa Time (EAT)</option>
              <option value="Europe/London">GMT / London</option>
              <option value="Europe/Paris">Central European Time (CET)</option>
              <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
              <option value="America/New_York">Eastern Time (ET)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900">Security</h2>
        </div>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
              className="w-5 h-5 rounded text-blue-600"
            />
          </label>
          <button className="flex items-center gap-2 text-blue-600 hover:underline">
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
