'use client';

import { useEffect, useState } from 'react';
import { Search, FileText } from 'lucide-react';
import { adminApi } from '@/lib/api';
import type { AuditLog, Role } from '@/lib/mock-db';

const roleColors: Record<Role, string> = {
  customer: 'bg-blue-100 text-blue-700',
  warehouse: 'bg-purple-100 text-purple-700',
  admin: 'bg-green-100 text-green-700',
};

const actionColors: Record<string, string> = {
  PRODUCT_APPROVED: 'bg-green-50 text-green-700',
  PRODUCT_REJECTED: 'bg-red-50 text-red-700',
  PRODUCT_CREATED: 'bg-blue-50 text-blue-700',
  ORDER_PLACED: 'bg-purple-50 text-purple-700',
};

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
        setLogs(res.data || res as unknown as AuditLog[]);
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  let filteredLogs = logs;
  if (roleFilter !== 'all') {
    filteredLogs = filteredLogs.filter(l => l.actor_role === roleFilter);
  }
  if (actionFilter !== 'all') {
    filteredLogs = filteredLogs.filter(l => l.action === actionFilter);
  }
  if (searchQuery) {
    filteredLogs = filteredLogs.filter(l =>
      l.actor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.entity_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  filteredLogs = [...filteredLogs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const uniqueActions = Array.from(new Set(logs.map(l => l.action)));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-gray-500">Track all platform activities and changes</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by actor, action, or entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as Role | 'all')}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="warehouse">Warehouse</option>
          <option value="customer">Customer</option>
        </select>
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>{action.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
        {filteredLogs.map((log) => (
          <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{log.actor_name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[log.actor_role]}`}>
                    {log.actor_role}
                  </span>
                  <span className="text-gray-400">performed</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${actionColors[log.action] || 'bg-gray-100 text-gray-700'}`}>
                    {log.action.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  on <span className="font-medium">{log.entity_type}</span> ({log.entity_id})
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(log.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredLogs.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No audit logs found</p>
        </div>
      )}
    </div>
  );
}
