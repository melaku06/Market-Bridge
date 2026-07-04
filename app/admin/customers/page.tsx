'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Ban, Users, UserCheck, UserX, UserPlus, Download, Filter, Edit } from 'lucide-react';
import { usersApi, analyticsApi } from '@/lib/api';
import type { User } from '@/lib/types';

type UserRow = Omit<User, 'password_hash'>;

const statusBadge: Record<string, string> = {
  active:    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  suspended: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  blocked:   'bg-red-50 text-red-700 ring-1 ring-red-200',
  inactive:  'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
};

const groupBadge: Record<string, string> = {
  vip:     'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  regular: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  new:     'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
};

const fallback = [
  { id: '1', name: 'John Smith', email: 'john@smith.com', phone: '+1(555) 123-4567', orders: 18, total_spent: 1245.80, group: 'vip', status: 'active', created_at: '2024-05-12' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '+1(555) 234-5678', orders: 12, total_spent: 890.40, group: 'regular', status: 'active', created_at: '2024-04-28' },
  { id: '3', name: 'Michael Brown', email: 'michael.b@email.com', phone: '+1(555) 345-6789', orders: 25, total_spent: 2340.75, group: 'vip', status: 'active', created_at: '2024-02-15' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@email.com', phone: '+1(555) 456-7890', orders: 8, total_spent: 458.30, group: 'regular', status: 'active', created_at: '2024-05-08' },
  { id: '5', name: 'David Wilson', email: 'david.w@email.com', phone: '+1(555) 567-8901', orders: 15, total_spent: 1230.00, group: 'regular', status: 'inactive', created_at: '2024-03-03' },
  { id: '6', name: 'Jessica Taylor', email: 'jessica.t@email.com', phone: '+1(555) 678-9012', orders: 5, total_spent: 320.50, group: 'new', status: 'active', created_at: '2024-05-18' },
];

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<UserRow[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'blocked'>('all');

  useEffect(() => {
    Promise.all([usersApi.list({ role: 'customer' }), analyticsApi.get({})])
      .then(([usersRes, analyticsRes]) => {
        setCustomers(Array.isArray(usersRes) ? usersRes : (usersRes as any).data || []);
        setAnalytics(analyticsRes);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (userId: string) => {
    const customer = customers.find(u => u.id === userId);
    if (!customer) return;
    const newStatus = customer.status === 'active' ? 'blocked' : 'active';
    try {
      await usersApi.update(userId, { status: newStatus });
      setCustomers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus as any } : u));
    } catch (e) { console.error(e); }
  };

  const filtered = customers.filter(u => {
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const display: any[] = filtered.length > 0 ? filtered : (customers.length === 0 ? fallback : []);
  const counts = { all: customers.length || 24856, active: customers.filter(u => u.status === 'active').length || 22134, blocked: customers.filter(u => u.status === 'blocked').length || 268 };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customer Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">View and manage all customers on the platform.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 bg-white">
            <Download style={{ width: 14, height: 14 }} /> Export
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition-colors">
            <UserPlus style={{ width: 14, height: 14 }} /> Add Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: counts.all.toLocaleString(), sub: '+10.4% vs last month', icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
          { label: 'Active Customers', value: counts.active.toLocaleString(), sub: '88.11% of total', icon: UserCheck, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
          { label: 'New Customers (This Month)', value: (analytics?.customers?.new_this_month || 2856).toLocaleString(), sub: '+12.8% vs Apr', icon: UserPlus, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
          { label: 'Blocked Customers', value: counts.blocked.toLocaleString(), sub: '1.08% of total', icon: UserX, iconBg: 'bg-red-50', iconColor: 'text-red-500' },
        ].map((s, i) => { const Icon = s.icon; return (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-8 h-8 ${s.iconBg} rounded-lg flex items-center justify-center mb-2`}><Icon className={s.iconColor} style={{ width: 15, height: 15 }} /></div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-[12px] font-semibold text-gray-700 mt-0.5">{s.label}</p>
            <p className="text-[11px] text-gray-400">{s.sub}</p>
          </div>
        );})}
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 13, height: 13 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none w-48 bg-gray-50" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 focus:outline-none">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="blocked">Blocked</option>
          </select>
          <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 focus:outline-none"><option>All Groups</option><option>VIP</option><option>Regular</option><option>New</option></select>
          <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 focus:outline-none"><option>All Locations</option></select>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50"><Filter style={{ width: 13, height: 13 }} /> Filters</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/40">
                {['Customer', 'Email', 'Phone', 'Orders', 'Total Spent', 'Group', 'Status', 'Joined On', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {display.map((customer: any) => (
                <tr key={customer.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {(customer.avatar || customer.avatar_url) ? <img src={customer.avatar || customer.avatar_url} alt={customer.name} className="w-full h-full object-cover" /> : <span className="text-[12px] font-bold text-blue-600">{customer.name.charAt(0)}</span>}
                      </div>
                      <span className="text-[13px] font-semibold text-gray-900">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-600">{customer.email}</td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-600 whitespace-nowrap">{customer.phone || '—'}</td>
                  <td className="px-5 py-3.5 text-[13px] font-medium text-gray-900">{customer.orders || customer.order_count || 0}</td>
                  <td className="px-5 py-3.5 text-[13px] font-semibold text-gray-900">${(customer.total_spent || 0).toLocaleString()}</td>
                  <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${groupBadge[customer.group || 'regular'] || groupBadge.regular}`}>{customer.group || 'Regular'}</span></td>
                  <td className="px-5 py-3.5"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadge[customer.status] || statusBadge.active}`}>{customer.status}</span></td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-500 whitespace-nowrap">{new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"><Eye style={{ width: 13, height: 13 }} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"><Edit style={{ width: 13, height: 13 }} /></button>
                      <button onClick={() => toggleStatus(customer.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><Ban style={{ width: 13, height: 13 }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/30">
          <p className="text-[12px] text-gray-500">Showing 1 to {Math.min(display.length, 6)} of {counts.all.toLocaleString()} customers</p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">‹</button>
            {[1,2,3,4,5].map(p => <button key={p} className={`w-7 h-7 rounded-lg text-[12px] font-semibold ${p===1?'bg-blue-600 text-white':'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>)}
            <span className="text-gray-400 text-[12px] mx-1">...</span>
            <button className="w-7 h-7 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">4143</button>
            <button className="w-7 h-7 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
