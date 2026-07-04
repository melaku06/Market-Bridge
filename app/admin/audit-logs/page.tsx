'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, FileText, ChevronRight, Download, Filter, Shield, User, Package, ShoppingCart, Settings } from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { AuditLog, Role } from '@/lib/types';

const roleColors: Record<string, string> = {
  customer: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  warehouse: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  admin: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
};

const actionColors: Record<string, string> = {
  PRODUCT_APPROVED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  PRODUCT_REJECTED: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  PRODUCT_CREATED: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  ORDER_PLACED: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  ORDER_UPDATED: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  USER_REGISTERED: 'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200',
  WAREHOUSE_APPROVED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  SETTINGS_UPDATED: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200',
};

const actionIcons: Record<string, React.ReactNode> = {
  PRODUCT_APPROVED: <Package className="w-4 h-4" />,
  PRODUCT_REJECTED: <Package className="w-4 h-4" />,
  PRODUCT_CREATED: <Package className="w-4 h-4" />,
  ORDER_PLACED: <ShoppingCart className="w-4 h-4" />,
  ORDER_UPDATED: <ShoppingCart className="w-4 h-4" />,
  USER_REGISTERED: <User className="w-4 h-4" />,
  WAREHOUSE_APPROVED: <Shield className="w-4 h-4" />,
  SETTINGS_UPDATED: <Settings className="w-4 h-4" />,
};

const actionIconBg: Record<string, string> = {
  PRODUCT_APPROVED: 'bg-emerald-50 text-emerald-600',
  PRODUCT_REJECTED: 'bg-red-50 text-red-600',
  PRODUCT_CREATED: 'bg-blue-50 text-blue-600',
  ORDER_PLACED: 'bg-violet-50 text-violet-600',
  ORDER_UPDATED: 'bg-amber-50 text-amber-600',
  USER_REGISTERED: 'bg-cyan-50 text-cyan-600',
  WAREHOUSE_APPROVED: 'bg-emerald-50 text-emerald-600',
  SETTINGS_UPDATED: 'bg-gray-100 text-gray-600',
};

const tabs = ['all', 'admin', 'warehouse', 'customer'] as const;

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await adminApi.auditLogs.list();
        const logsData = Array.isArray(res) ? res : (res as any).data || [];
        setLogs(logsData);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  let filtered = logs;
  if (roleFilter !== 'all') filtered = filtered.filter(l => l.actor_role === roleFilter);
  if (actionFilter !== 'all') filtered = filtered.filter(l => l.action === actionFilter);
  if (searchQuery) {
    filtered = filtered.filter(l =>
      l.actor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.entity_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const uniqueActions = Array.from(new Set(logs.map(l => l.action)));

  const counts = {
    all: logs.length,
    admin: logs.filter(l => l.actor_role === 'admin').length,
    warehouse: logs.filter(l => l.actor_role === 'warehouse').length,
    customer: logs.filter(l => l.actor_role === 'customer').length,
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
            <span className="text-gray-700 font-medium">Audit Logs</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track all platform activities and changes.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors bg-white">
          <Download className="w-4 h-4" /><span className="hidden sm:inline">Export Logs</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Logs', value: counts.all, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Admin Actions', value: counts.admin, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Warehouse Actions', value: counts.warehouse, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Customer Actions', value: counts.customer, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
              <FileText className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="flex overflow-x-auto gap-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setRoleFilter(tab as any)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 capitalize ${
                  roleFilter === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${roleFilter === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                  {counts[tab as keyof typeof counts]}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44 bg-gray-50 focus:bg-white transition-all"
              />
            </div>
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none bg-white text-gray-600"
            >
              <option value="all">All Actions</option>
              {uniqueActions.map(action => <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actor</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Entity</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center">
                  <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No audit logs found</p>
                </td></tr>
              ) : filtered.map(log => (
                <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${actionIconBg[log.action] || 'bg-gray-100 text-gray-500'}`}>
                        {actionIcons[log.action] || <FileText className="w-4 h-4" />}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{log.actor_name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${roleColors[log.actor_role] || 'bg-gray-100 text-gray-600'}`}>
                      {log.actor_role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${actionColors[log.action] || 'bg-gray-100 text-gray-600'}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-700 capitalize">{log.entity_type}</p>
                    <p className="text-xs text-gray-400 font-mono">{log.entity_id}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {new Date(log.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of <span className="font-semibold text-gray-700">{logs.length}</span> logs
          </p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">‹</button>
            <button className="w-7 h-7 rounded-lg text-xs font-semibold bg-blue-600 text-white">1</button>
            <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
