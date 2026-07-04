'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Save, Camera, Building2, Check, ChevronRight, Star, Package, ShoppingCart, MapPin, Phone, Mail, CreditCard, FileText, Shield } from 'lucide-react';
import { warehousesApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Warehouse } from '@/lib/types';

export default function WarehouseProfile() {
  const { user } = useAuth();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', owner_name: '', email: '', phone: '', address: '', city: '', country: '',
    business_type: '', bank_name: '', bank_account: '', tax_id: '',
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
          name: warehouseRes.name, owner_name: warehouseRes.owner_name, email: warehouseRes.email,
          phone: warehouseRes.phone, address: warehouseRes.address, city: warehouseRes.city, country: warehouseRes.country,
          business_type: warehouseRes.business_type || '', bank_name: warehouseRes.bank_name || '',
          bank_account: warehouseRes.bank_account || '', tax_id: warehouseRes.tax_id || '',
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); }, 1000);
  };

  const field = (label: string) => (
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
  );

  const inputClass = "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 focus:bg-white transition-all";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
          <Link href="/warehouse" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium">Profile</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Warehouse Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your warehouse information and business details.</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center ring-4 ring-blue-50">
              <Building2 className="w-10 h-10 text-blue-600" />
            </div>
            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors shadow-md">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{warehouse.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">Member since {new Date(warehouse.member_since).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                warehouse.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
                warehouse.status === 'pending_approval' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' :
                'bg-red-50 text-red-700 ring-1 ring-red-200'
              }`}>
                {warehouse.status === 'active' && <Check className="w-3 h-3" />}
                {warehouse.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {Number(warehouse.rating).toFixed(1)}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="px-3">
              <p className="text-2xl font-bold text-gray-900">{Number(warehouse.total_products)}</p>
              <p className="text-xs text-gray-500 mt-0.5">Products</p>
            </div>
            <div className="px-3 border-x border-gray-100">
              <p className="text-2xl font-bold text-gray-900">{Number(warehouse.total_orders)}</p>
              <p className="text-xs text-gray-500 mt-0.5">Orders</p>
            </div>
            <div className="px-3">
              <p className="text-2xl font-bold text-gray-900">{Number(warehouse.performance_score)}%</p>
              <p className="text-xs text-gray-500 mt-0.5">Score</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left - Forms */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <h2 className="font-bold text-gray-900">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {field('Warehouse Name')}
                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
              </div>
              <div>
                {field('Owner Name')}
                <input type="text" value={formData.owner_name} onChange={e => setFormData({ ...formData, owner_name: e.target.value })} className={inputClass} />
              </div>
              <div>
                {field('Business Type')}
                <input type="text" value={formData.business_type} onChange={e => setFormData({ ...formData, business_type: e.target.value })} className={inputClass} placeholder="e.g. Retail, Wholesale" />
              </div>
              <div>
                {field('Tax ID')}
                <input type="text" value={formData.tax_id} onChange={e => setFormData({ ...formData, tax_id: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <h2 className="font-bold text-gray-900">Contact Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {field('Email')}
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className={inputClass} />
              </div>
              <div>
                {field('Phone')}
                <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                {field('Address')}
                <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className={inputClass} />
              </div>
              <div>
                {field('City')}
                <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className={inputClass} />
              </div>
              <div>
                {field('Country')}
                <input type="text" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Banking Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 bg-violet-50 rounded-lg flex items-center justify-center">
                <CreditCard className="w-3.5 h-3.5 text-violet-600" />
              </div>
              <h2 className="font-bold text-gray-900">Banking Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                {field('Bank Name')}
                <input type="text" value={formData.bank_name} onChange={e => setFormData({ ...formData, bank_name: e.target.value })} className={inputClass} placeholder="Bank name" />
              </div>
              <div>
                {field('Account Number')}
                <input type="text" value={formData.bank_account} onChange={e => setFormData({ ...formData, bank_account: e.target.value })} className={inputClass} placeholder="Account number" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-500">
              <Shield className="w-3.5 h-3.5 text-gray-400" />
              Banking information is used for payouts and is kept secure.
            </div>
          </div>
        </div>

        {/* Right - Summary + Actions */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4">Profile Completion</h3>
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="42" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                <circle cx="48" cy="48" r="42" stroke="#2563eb" strokeWidth="8" fill="none" strokeLinecap="round" strokeDasharray={`${0.85 * 264} 264`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">85%</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mb-4">Your profile is 85% complete. Add banking info to reach 100%.</p>
            <div className="space-y-2">
              {[
                { label: 'Basic Info', done: true },
                { label: 'Contact Info', done: true },
                { label: 'Banking Info', done: formData.bank_name !== '' },
                { label: 'Tax ID', done: formData.tax_id !== '' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  {item.done ? <Check className="w-4 h-4 text-emerald-500" /> : <div className="w-4 h-4 rounded-full border-2 border-gray-200" />}
                  <span className={item.done ? 'text-gray-700' : 'text-gray-400'}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-600/20"
            >
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
