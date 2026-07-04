'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Building2, ChevronRight, MapPin, CreditCard, FileText, Edit2, Check, Shield, Truck } from 'lucide-react';
import { warehousesApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Warehouse } from '@/lib/types';

export default function WarehouseProfile() {
  const { user } = useAuth();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    order_notifications: true,
    low_stock_alerts: true,
    email_updates: true,
    sms_notifications: false,
  });

  useEffect(() => {
    async function fetchWarehouse() {
      const warehouseId = user?.warehouse_id;
      if (!warehouseId) return;
      try {
        const warehouseRes = await warehousesApi.get(warehouseId);
        setWarehouse(warehouseRes);
      } catch (error) {
        console.error('Failed to fetch warehouse:', error);
      } finally {
        setLoading(false);
      }
    }
    if (user?.warehouse_id) fetchWarehouse();
  }, [user?.warehouse_id]);

  if (loading || !warehouse) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${value ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${value ? 'right-0.5' : 'left-0.5'}`} />
    </button>
  );

  const EditBtn = () => (
    <button className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:underline">
      <Edit2 className="w-3 h-3" />
      Edit
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
          <Link href="/warehouse" className="hover:text-blue-600">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium">Profile</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Warehouse Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your warehouse information and settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Warehouse Profile Card */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Warehouse Profile</h3>
              <EditBtn />
            </div>
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center border-2 border-blue-100 mb-3">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm">{warehouse.name}</h4>
            </div>
            <div className="space-y-2.5">
              {[
                { label: 'Warehouse Code', value: 'WH-001' },
                { label: 'Owner Name', value: warehouse.owner_name },
                { label: 'Email', value: warehouse.email },
                { label: 'Phone', value: warehouse.phone },
                { label: 'Established', value: new Date(warehouse.member_since).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
              ].map(item => (
                <div key={item.label} className="flex items-start justify-between">
                  <span className="text-xs text-gray-500 flex-shrink-0">{item.label}</span>
                  <span className="text-xs text-gray-800 font-medium text-right ml-2 truncate max-w-[60%]">{item.value || '—'}</span>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Status</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <Check className="w-3 h-3" />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <h3 className="font-bold text-gray-900 text-sm">Address</h3>
              </div>
              <EditBtn />
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              <p>{warehouse.address || '123 Warehouse Lane'}</p>
              <p>{warehouse.city}{warehouse.country ? `, ${warehouse.country}` : ''}</p>
            </div>
            <button className="mt-3 text-xs text-blue-600 font-medium hover:underline">View on Map</button>
          </div>

          {/* Bank Details */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <h3 className="font-bold text-gray-900 text-sm">Bank Details</h3>
              </div>
              <EditBtn />
            </div>
            <div className="space-y-2">
              {[
                { label: 'Bank Name', value: warehouse.bank_name || 'Chase Bank' },
                { label: 'Account Holder', value: warehouse.owner_name },
                { label: 'Account Number', value: warehouse.bank_account ? '••••' + warehouse.bank_account.slice(-4) : '•••• 1234' },
                { label: 'Routing Number', value: '071000021' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-xs text-gray-800 font-medium">{item.value || '—'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* KYC Documents */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-gray-400" />
              <h3 className="font-bold text-gray-900 text-sm">KYC Documents</h3>
            </div>
            <div className="space-y-2">
              {['Business License', 'Tax Certificate', 'ID Proof'].map((doc) => (
                <div key={doc} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    <div>
                      <p className="text-xs font-medium text-gray-700">{doc}</p>
                      <p className="text-[10px] text-gray-400">Uploaded on Jan 15, 2023</p>
                    </div>
                  </div>
                  <button className="text-xs text-blue-600 font-medium hover:underline">View</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column */}
        <div className="space-y-4">
          {/* Business Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Business Information</h3>
              <EditBtn />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Business Type</label>
                <p className="text-sm font-medium text-gray-800">{warehouse.business_type || 'Electronics & Accessories'}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tax ID</label>
                <p className="text-sm font-medium text-gray-800">{warehouse.tax_id || 'TX-123456789'}</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Company Registration</label>
                <p className="text-sm font-medium text-gray-800">BRN-987654321</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Shipping Information */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-gray-400" />
                <h3 className="font-bold text-gray-900 text-sm">Shipping Information</h3>
              </div>
              <EditBtn />
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Default Shipping Partner</label>
                <p className="text-sm font-medium text-gray-800">MarketBridge Express</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Shipping Rate</label>
                <p className="text-sm font-medium text-gray-800">$0.00 - $5.99</p>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Processing Time</label>
                <p className="text-sm font-medium text-gray-800">1-2 Business Days</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Settings</h3>
              <EditBtn />
            </div>
            <div className="space-y-3">
              {[
                { key: 'order_notifications', label: 'Receive Order Notifications' },
                { key: 'low_stock_alerts', label: 'Low Stock Alerts' },
                { key: 'email_updates', label: 'Email Updates' },
                { key: 'sms_notifications', label: 'SMS Notifications' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <Toggle
                    value={settings[item.key as keyof typeof settings]}
                    onChange={() => setSettings(s => ({ ...s, [item.key]: !s[item.key as keyof typeof settings] }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
