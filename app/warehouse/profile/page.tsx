'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Building, MapPin, CreditCard, Truck, Bell, FileText, Edit2, CheckCircle2 } from 'lucide-react';
import { warehousesApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Warehouse } from '@/lib/types';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} type="button"
      className={`relative w-10 h-5.5 rounded-full transition-colors focus:outline-none ${on ? 'bg-purple-600' : 'bg-gray-200'}`}
      style={{ width: 40, height: 22 }}>
      <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-all ${on ? 'left-[18px]' : 'left-0.5'}`}
        style={{ width: 18, height: 18, left: on ? 20 : 2, top: 2 }} />
    </button>
  );
}

export default function WarehouseProfile() {
  const { user } = useAuth();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState({
    order_notifications: true,
    low_stock_alerts: true,
    email_updates: false,
    sms_notifications: false,
    weekly_reports: true,
    promotional: false,
  });

  useEffect(() => {
    const wid = user?.warehouse_id;
    if (!wid) return;
    warehousesApi.get(wid).then(setWarehouse).catch(console.error).finally(() => setLoading(false));
  }, [user?.warehouse_id]);

  const toggle = (k: keyof typeof prefs) => setPrefs(p => ({ ...p, [k]: !p[k] }));

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!warehouse) return (
    <div className="flex items-center justify-center py-32">
      <p className="text-sm text-gray-400">Warehouse data unavailable.</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Warehouse Profile</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your warehouse information and settings</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        {/* Left Column */}
        <div className="space-y-5">
          {/* Warehouse Profile */}
          <Card
            title="Warehouse Profile"
            icon={Building}
            action={<EditBtn />}
          >
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-50">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                {warehouse.name?.charAt(0).toUpperCase() || 'W'}
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold text-gray-900 truncate">{warehouse.name}</p>
                <p className="text-xs text-gray-400">#{warehouse.id?.slice(-8).toUpperCase()}</p>
                <span className={`mt-1 inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${warehouse.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {warehouse.status?.charAt(0).toUpperCase() + warehouse.status?.slice(1)}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <ProfileRow label="Owner" value={warehouse.owner_name} />
              <ProfileRow label="Email" value={warehouse.email} />
              <ProfileRow label="Phone" value={warehouse.phone} />
              <ProfileRow label="Member Since" value={warehouse.member_since ? new Date(warehouse.member_since).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'} />
              <ProfileRow label="Rating" value={warehouse.rating ? `${Number(warehouse.rating).toFixed(1)} ★` : '—'} />
            </div>
          </Card>

          {/* Address */}
          <Card title="Address" icon={MapPin} action={<EditBtn />}>
            <div className="space-y-3">
              <ProfileRow label="Address" value={warehouse.address || '—'} />
              <ProfileRow label="City" value={warehouse.city || '—'} />
              <ProfileRow label="Country" value={warehouse.country || '—'} />
            </div>
          </Card>

          {/* Bank Details */}
          <Card title="Bank Details" icon={CreditCard} action={<EditBtn />}>
            <div className="space-y-3">
              <ProfileRow label="Bank" value={warehouse.bank_name || '—'} />
              <ProfileRow label="Account" value={warehouse.bank_account ? `****${warehouse.bank_account.slice(-4)}` : '—'} />
            </div>
          </Card>
        </div>

        {/* Middle Column */}
        <div className="space-y-5">
          {/* Business Info */}
          <Card title="Business Information" icon={Building} action={<EditBtn />}>
            <div className="space-y-3">
              <ProfileRow label="Business Type" value={warehouse.business_type || '—'} />
              <ProfileRow label="Tax ID" value={warehouse.tax_id || '—'} />
              <ProfileRow label="Total Products" value={String(warehouse.total_products || 0)} />
              <ProfileRow label="Total Orders" value={String(warehouse.total_orders || 0)} />
              <ProfileRow label="Total Sales" value={`${Number(warehouse.total_sales || 0).toLocaleString()} Br`} />
              <ProfileRow label="Performance" value={warehouse.performance_score ? `${warehouse.performance_score}%` : '—'} />
            </div>
          </Card>

          {/* KYC Documents */}
          <Card title="Verification Documents" icon={FileText}>
            <div className="space-y-3">
              {[
                { name: 'Business Registration', date: 'Uploaded Jan 2024' },
                { name: 'Tax Certificate', date: 'Uploaded Jan 2024' },
                { name: 'Identity Document', date: 'Uploaded Feb 2024' },
              ].map(doc => (
                <div key={doc.name} className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                  <CheckCircle2 className="text-emerald-500 flex-shrink-0" style={{ width: 16, height: 16 }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800">{doc.name}</p>
                    <p className="text-[10px] text-gray-400">{doc.date}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Verified</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Shipping */}
          <Card title="Shipping Information" icon={Truck} action={<EditBtn />}>
            <div className="space-y-3">
              <ProfileRow label="Processing Time" value="1–2 business days" />
              <ProfileRow label="Shipping Methods" value="Standard, Express" />
              <ProfileRow label="Delivery Range" value="Nationwide" />
              <ProfileRow label="Free Shipping Above" value="500 Br" />
            </div>
          </Card>

          {/* Notifications */}
          <Card title="Notification Settings" icon={Bell}>
            <div className="space-y-3.5">
              {(Object.keys(prefs) as Array<keyof typeof prefs>).map(k => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{k.replace(/_/g, ' ')}</span>
                  <Toggle on={prefs[k]} onToggle={() => toggle(k)} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, children, action }: { title: string; icon: any; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center">
            <Icon className="text-purple-500" style={{ width: 14, height: 14 }} />
          </div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-gray-400 flex-shrink-0">{label}</span>
      <span className="text-xs font-medium text-gray-800 text-right truncate">{value || '—'}</span>
    </div>
  );
}

function EditBtn() {
  return (
    <button className="flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-800 transition-colors">
      <Edit2 style={{ width: 12, height: 12 }} /> Edit
    </button>
  );
}
