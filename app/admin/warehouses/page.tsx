'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Check, X, Building2, Star, ChevronRight, Download, Filter, TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { warehousesApi } from '@/lib/api';
import type { WarehouseStatus, Warehouse } from '@/lib/types';

const statusBadge: Record<string, string> = {
  pending_approval: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  active:           'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  suspended:        'bg-red-50 text-red-700 ring-1 ring-red-200',
  deactivated:      'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
};

const statusLabels: Record<string, string> = {
  all: 'All', pending_approval: 'Pending', active: 'Active', suspended: 'Suspended', deactivated: 'Deactivated',
};

const tabs = ['all', 'active', 'pending_approval', 'suspended'] as const;

export default function AdminWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WarehouseStatus | 'all'>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await warehousesApi.list({});
        setWarehouses(Array.isArray(res) ? res : (res as any).data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const filtered = warehouses.filter(w => {
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;
    if (searchQuery && !w.name.toLowerCase().includes(searchQuery.toLowerCase()) && !w.owner_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: warehouses.length,
    active: warehouses.filter(w => w.status === 'active').length,
    pending_approval: warehouses.filter(w => w.status === 'pending_approval').length,
    suspended: warehouses.filter(w => w.status === 'suspended').length,
    deactivated: warehouses.filter(w => w.status === 'deactivated').length,
  };

  const handleApprove = async (id: string) => {
    await warehousesApi.update(id, { status: 'active' });
    setWarehouses(prev => prev.map(w => w.id === id ? { ...w, status: 'active' as const } : w));
    setSelectedWarehouse(null);
  };

  const handleSuspend = async (id: string) => {
    await warehousesApi.update(id, { status: 'suspended' });
    setWarehouses(prev => prev.map(w => w.id === id ? { ...w, status: 'suspended' as const } : w));
    setSelectedWarehouse(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/admin" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Warehouses</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Warehouse Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and approve warehouse applications.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors bg-white">
            <Download className="w-4 h-4" /><span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Warehouses', value: counts.all, color: 'text-blue-600', bg: 'bg-blue-50', icon: Building2 },
          { label: 'Active', value: counts.active, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: TrendingUp },
          { label: 'Pending Approval', value: counts.pending_approval, color: 'text-amber-600', bg: 'bg-amber-50', icon: Package },
          { label: 'Suspended', value: counts.suspended, color: 'text-red-600', bg: 'bg-red-50', icon: X },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="flex overflow-x-auto gap-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab as any)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  statusFilter === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {statusLabels[tab]}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${statusFilter === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                  {counts[tab as keyof typeof counts] ?? 0}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search warehouses..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44 bg-gray-50 focus:bg-white transition-all"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Warehouse</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Products</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Revenue</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center">
                  <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No warehouses found</p>
                </td></tr>
              ) : filtered.map(warehouse => (
                <tr key={warehouse.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{warehouse.name}</p>
                        <p className="text-xs text-gray-400">{warehouse.owner_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{warehouse.city}, {warehouse.country}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-semibold text-gray-900">{Number(warehouse.rating).toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{Number(warehouse.total_products).toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">{Number(warehouse.total_sales).toLocaleString()} Br</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[warehouse.status]}`}>
                      {statusLabels[warehouse.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setSelectedWarehouse(warehouse)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      {warehouse.status === 'pending_approval' && (
                        <button onClick={() => handleApprove(warehouse.id)} className="text-xs text-emerald-600 font-semibold border border-emerald-200 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1">
                          <Check className="w-3 h-3" /> Approve
                        </button>
                      )}
                      {warehouse.status === 'active' && (
                        <button onClick={() => handleSuspend(warehouse.id)} className="text-xs text-red-600 font-semibold border border-red-200 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors">
                          Suspend
                        </button>
                      )}
                      {warehouse.status === 'suspended' && (
                        <button onClick={() => handleApprove(warehouse.id)} className="text-xs text-emerald-600 font-semibold border border-emerald-200 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors">
                          Reactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of <span className="font-semibold text-gray-700">{warehouses.length}</span> warehouses
          </p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">‹</button>
            <button className="w-7 h-7 rounded-lg text-xs font-semibold bg-blue-600 text-white">1</button>
            <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">›</button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedWarehouse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedWarehouse(null)}>
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Building2 className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{selectedWarehouse.name}</h2>
                    <p className="text-sm text-gray-500">{selectedWarehouse.owner_name}</p>
                    <span className={`inline-flex items-center mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${statusBadge[selectedWarehouse.status]}`}>
                      {statusLabels[selectedWarehouse.status]}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedWarehouse(null)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Email', value: selectedWarehouse.email },
                  { label: 'Phone', value: selectedWarehouse.phone },
                  { label: 'City', value: selectedWarehouse.city },
                  { label: 'Business Type', value: selectedWarehouse.business_type || 'N/A' },
                  { label: 'Total Products', value: Number(selectedWarehouse.total_products).toLocaleString() },
                  { label: 'Total Orders', value: Number(selectedWarehouse.total_orders).toLocaleString() },
                  { label: 'Total Revenue', value: `${Number(selectedWarehouse.total_sales).toLocaleString()} Br` },
                  { label: 'Performance', value: `${Number(selectedWarehouse.performance_score)}%` },
                  { label: 'Rating', value: `${Number(selectedWarehouse.rating).toFixed(1)} ⭐` },
                  { label: 'Member Since', value: new Date(selectedWarehouse.member_since).toLocaleDateString() },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>

              {selectedWarehouse.status === 'pending_approval' && (
                <div className="flex gap-3 mt-5">
                  <button onClick={() => handleApprove(selectedWarehouse.id)} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                    <Check className="w-4 h-4" /> Approve Warehouse
                  </button>
                  <button onClick={() => handleSuspend(selectedWarehouse.id)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                    <X className="w-4 h-4" /> Reject Application
                  </button>
                </div>
              )}
              {selectedWarehouse.status === 'active' && (
                <button onClick={() => handleSuspend(selectedWarehouse.id)} className="w-full mt-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                  <X className="w-4 h-4" /> Suspend Warehouse
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
