'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Save, Camera, Building2, Check } from 'lucide-react';
import { warehousesApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Warehouse } from '@/lib/types';

export default function WarehouseProfile() {
  const { user } = useAuth();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    owner_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    business_type: '',
    bank_name: '',
    bank_account: '',
    tax_id: '',
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchWarehouse() {
      const warehouseId = user?.warehouse_id;
      if (!warehouseId) return;
      try {
        const warehouseRes = await warehousesApi.get(warehouseId);
        setWarehouse(warehouseRes);
        setFormData({
          name: warehouseRes.name,
          owner_name: warehouseRes.owner_name,
          email: warehouseRes.email,
          phone: warehouseRes.phone,
          address: warehouseRes.address,
          city: warehouseRes.city,
          country: warehouseRes.country,
          business_type: warehouseRes.business_type || '',
          bank_name: warehouseRes.bank_name || '',
          bank_account: warehouseRes.bank_account || '',
          tax_id: warehouseRes.tax_id || '',
        });
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Warehouse Profile</h1>
        <p className="text-gray-500 mt-0.5">Manage your warehouse information</p>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center ring-4 ring-white shadow-lg">
              <Building2 className="w-10 h-10 text-violet-600" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-violet-600 text-white rounded-xl flex items-center justify-center hover:bg-violet-700 transition-colors shadow-md">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{warehouse.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Member since {new Date(warehouse.member_since).toLocaleDateString()}</p>
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                warehouse.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
                warehouse.status === 'pending_approval' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' :
                'bg-red-50 text-red-700 ring-1 ring-red-200'
              }`}>
                {warehouse.status === 'active' && <Check className="w-3 h-3" />}
                {warehouse.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="px-4">
              <p className="text-2xl font-bold text-gray-900">{warehouse.total_products}</p>
              <p className="text-xs text-gray-500 mt-0.5">Products</p>
            </div>
            <div className="px-4 border-x border-gray-100">
              <p className="text-2xl font-bold text-gray-900">{warehouse.total_orders}</p>
              <p className="text-xs text-gray-500 mt-0.5">Orders</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-bold text-gray-900">{warehouse.rating.toFixed(1)}</p>
              <p className="text-xs text-gray-500 mt-0.5">Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-5">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Warehouse Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Owner Name</label>
            <input
              type="text"
              value={formData.owner_name}
              onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Type</label>
            <input
              type="text"
              value={formData.business_type}
              onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Tax ID</label>
            <input
              type="text"
              value={formData.tax_id}
              onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-5">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">City, State</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Banking Information */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-5">Banking Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Name</label>
            <input
              type="text"
              value={formData.bank_name}
              onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Bank Account</label>
            <input
              type="text"
              value={formData.bank_account}
              onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 flex items-center gap-1.5">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Banking information is used for payouts and is kept secure.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-violet-700 transition-all disabled:opacity-50 shadow-sm hover:shadow-md"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
