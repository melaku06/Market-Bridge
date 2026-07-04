'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Save, Camera, Building2, Check, Star, Edit2, MapPin, Phone, Mail, CreditCard, FileText, Shield, ChevronRight } from 'lucide-react';
import Link from 'next/link';
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
    shipping_partner: 'MarketBridge Express', shipping_rate_min: '3.00', shipping_rate_max: '5.00',
    processing_time: '1-2 Business Days',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({
    receiveOrderNotifs: true,
    lowStockAlerts: true,
    emailUpdates: true,
    smsNotifications: false,
  });

  useEffect(() => {
    async function fetchWarehouse() {
      const warehouseId = user?.warehouse_id;
      if (!warehouseId) return;
      try {
        const warehouseRes = await warehousesApi.get(warehouseId);
        setWarehouse(warehouseRes);
        setFormData({
          name: warehouseRes.name, owner_name: warehouseRes.owner_name, email: warehouseRes.email,
          phone: warehouseRes.phone, address: warehouseRes.address, city: warehouseRes.city,
          country: warehouseRes.country, business_type: warehouseRes.business_type || '',
          bank_name: warehouseRes.bank_name || '', bank_account: warehouseRes.bank_account || '',
          tax_id: warehouseRes.tax_id || '', shipping_partner: 'MarketBridge Express',
          shipping_rate_min: '3.00', shipping_rate_max: '5.00', processing_time: '1-2 Business Days',
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
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await warehousesApi.update(warehouse.id, {
        name: formData.name, owner_name: formData.owner_name, email: formData.email,
        phone: formData.phone, address: formData.address, city: formData.city,
        country: formData.country, business_type: formData.business_type,
        bank_name: formData.bank_name, bank_account: formData.bank_account, tax_id: formData.tax_id,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setSaving(false);
    }
  };

  const inp = "w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-gray-50 focus:bg-white transition-all text-gray-700";

  const SectionCard = ({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit?: () => void }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        {onEdit && (
          <button onClick={onEdit} className="flex items-center gap-1.5 text-xs text-purple-600 font-medium hover:text-purple-700 px-2.5 py-1.5 rounded-lg hover:bg-purple-50 transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-emerald-500' : 'bg-gray-200'}`}
      style={{ width: 40, height: 22 }}
    >
      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-4.5' : ''}`}
        style={{ width: 18, height: 18, transform: checked ? 'translateX(18px)' : 'translateX(0)' }}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Warehouse Profile</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your warehouse information and settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-xl font-semibold text-sm transition-colors"
        >
          {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Warehouse Profile Card */}
          <SectionCard title="Warehouse Profile" onEdit={() => {}}>
            <div className="flex items-start gap-5">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-purple-500" />
                </div>
                <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 transition-colors shadow-sm">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Warehouse Name</p>
                  <p className="font-medium text-gray-900">{warehouse.name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Warehouse Code</p>
                  <p className="font-medium text-gray-900">WH-001</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Owner Name</p>
                  <p className="font-medium text-gray-900">{warehouse.owner_name}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Email</p>
                  <p className="font-medium text-gray-900 text-xs">{warehouse.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Established</p>
                  <p className="font-medium text-gray-900">{new Date(warehouse.member_since).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Status</p>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${warehouse.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {warehouse.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                    {warehouse.status === 'active' ? 'Active' : warehouse.status}
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Address */}
          <SectionCard title="Address" onEdit={() => {}}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">Street Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className={inp} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">City</label>
                <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className={inp} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Country</label>
                <input type="text" value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} className={inp} />
              </div>
              <div className="sm:col-span-2">
                <button className="flex items-center gap-1.5 text-xs text-purple-600 font-medium hover:text-purple-700 transition-colors">
                  <MapPin className="w-3.5 h-3.5" />
                  View on Map
                </button>
              </div>
            </div>
          </SectionCard>

          {/* Business Information */}
          <SectionCard title="Business Information" onEdit={() => {}}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Business Type</label>
                <input type="text" value={formData.business_type} onChange={e => setFormData({ ...formData, business_type: e.target.value })} className={inp} placeholder="e.g. Electronics & Accessories" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Tax ID</label>
                <input type="text" value={formData.tax_id} onChange={e => setFormData({ ...formData, tax_id: e.target.value })} className={inp} placeholder="TX-123456789" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Company Registration</label>
                <input type="text" defaultValue="BRN-987654321" className={inp} />
              </div>
            </div>
          </SectionCard>

          {/* Bank Details */}
          <SectionCard title="Bank Details" onEdit={() => {}}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Bank Name</label>
                <input type="text" value={formData.bank_name} onChange={e => setFormData({ ...formData, bank_name: e.target.value })} className={inp} placeholder="Bank name" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Account Holder</label>
                <input type="text" defaultValue={formData.owner_name} className={inp} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Account Number</label>
                <input type="text" value={formData.bank_account} onChange={e => setFormData({ ...formData, bank_account: e.target.value })} className={`${inp} font-mono`} placeholder="••••••••1234" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Routing Number</label>
                <input type="text" defaultValue="021000021" className={`${inp} font-mono`} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4 text-xs text-gray-400">
              <Shield className="w-3.5 h-3.5" />
              Banking information is encrypted and secure.
            </div>
          </SectionCard>

          {/* Shipping Information */}
          <SectionCard title="Shipping Information" onEdit={() => {}}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs text-gray-400 mb-1.5">Default Shipping Partner</label>
                <input type="text" value={formData.shipping_partner} onChange={e => setFormData({ ...formData, shipping_partner: e.target.value })} className={inp} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Shipping Rate</label>
                <div className="flex items-center gap-2">
                  <input type="text" value={`$${formData.shipping_rate_min}`} readOnly className={inp} />
                  <span className="text-gray-400 text-sm">–</span>
                  <input type="text" value={`$${formData.shipping_rate_max}`} readOnly className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Processing Time</label>
                <input type="text" value={formData.processing_time} onChange={e => setFormData({ ...formData, processing_time: e.target.value })} className={inp} />
              </div>
            </div>
          </SectionCard>

          {/* Settings / Notifications */}
          <SectionCard title="Settings" onEdit={() => {}}>
            <div className="space-y-4">
              {[
                { label: 'Receive Order Notifications', key: 'receiveOrderNotifs' },
                { label: 'Low Stock Alerts', key: 'lowStockAlerts' },
                { label: 'Email Updates', key: 'emailUpdates' },
                { label: 'SMS Notifications', key: 'smsNotifications' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <Toggle
                    checked={notifications[item.key as keyof typeof notifications]}
                    onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifications] }))}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-5">
          {/* KYC Documents */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">KYC Documents</h2>
            <div className="space-y-3">
              {[
                { label: 'Business License', date: 'Uploaded on Jan 15, 2023' },
                { label: 'Tax Certificate', date: 'Uploaded on Jan 15, 2023' },
                { label: 'ID Proof', date: 'Uploaded on Jan 15, 2023' },
              ].map(doc => (
                <div key={doc.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{doc.label}</p>
                      <p className="text-[10px] text-gray-400">{doc.date}</p>
                    </div>
                  </div>
                  <button className="text-xs text-purple-600 font-medium hover:text-purple-700">View</button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Products</span>
                <span className="text-sm font-bold text-gray-900">{Number(warehouse.total_products)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Total Orders</span>
                <span className="text-sm font-bold text-gray-900">{Number(warehouse.total_orders)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Performance</span>
                <span className="text-sm font-bold text-gray-900">{Number(warehouse.performance_score)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Rating</span>
                <span className="text-sm font-bold text-gray-900 flex items-center gap-1">
                  {Number(warehouse.rating).toFixed(1)}
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
