'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Download, Filter, Search, FileText, ChevronDown } from 'lucide-react';
import { adminApi } from '@/lib/api';

const actionColors: Record<string, string> = {
  'Logged in':         'bg-blue-50 text-blue-700',
  'Approved Product':  'bg-emerald-50 text-emerald-700',
  'Updated Margin':    'bg-violet-50 text-violet-700',
  'Added Product':     'bg-cyan-50 text-cyan-700',
  'Sent Notification': 'bg-amber-50 text-amber-700',
  'Updated Category':  'bg-teal-50 text-teal-700',
  'Updated Settings':  'bg-gray-100 text-gray-700',
  'Deleted User':      'bg-red-50 text-red-700',
  'Updated Inventory': 'bg-orange-50 text-orange-700',
  'Logged out':        'bg-gray-100 text-gray-600',
};

const fallbackLogs = [
  { id: '1', created_at: 'May 31, 2024 10:45 AM', actor_name: 'Admin', action: 'Logged in', entity_type: 'Authentication', details: 'Admin logged in successfully.', ip_address: '192.168.1.1' },
  { id: '2', created_at: 'May 31, 2024 10:30 AM', actor_name: 'Admin', action: 'Approved Product', entity_type: 'Product Approval', details: 'Product "iPhone 15 Pro" approved', ip_address: '192.168.1.1' },
  { id: '3', created_at: 'May 31, 2024 10:25 AM', actor_name: 'Admin', action: 'Updated Margin', entity_type: 'Margin Management', details: 'Category "Electronics" margin updated to 12%', ip_address: '192.168.1.1' },
  { id: '4', created_at: 'May 31, 2024 10:20 AM', actor_name: 'John (Warehouse)', action: 'Added Product', entity_type: 'Product Management', details: '"AirPods Pro" added', ip_address: '192.168.1.5' },
  { id: '5', created_at: 'May 31, 2024 10:15 AM', actor_name: 'Admin', action: 'Sent Notification', entity_type: 'Notifications', details: 'Sent "Weekend Mega Sale" notification', ip_address: '192.168.1.1' },
  { id: '6', created_at: 'May 31, 2024 10:13 AM', actor_name: 'Sarah (Admin)', action: 'Updated Category', entity_type: 'Categories', details: 'Category "Smartphones" updated', ip_address: '192.168.1.3' },
  { id: '7', created_at: 'May 31, 2024 10:05 AM', actor_name: 'Admin', action: 'Deleted User', entity_type: 'Customer Management', details: 'User "testuser@example.com" deleted', ip_address: '192.168.1.1' },
  { id: '8', created_at: 'May 31, 2024 10:00 AM', actor_name: 'Mike (Warehouse)', action: 'Updated Settings', entity_type: 'System Settings', details: 'Updated payment gateway settings', ip_address: '192.168.1.1' },
  { id: '9', created_at: 'May 31, 2024 09:58 AM', actor_name: 'Mike (Warehouse)', action: 'Updated Inventory', entity_type: 'Inventory Management', details: 'Stock updated for "AirPods Pro"', ip_address: '192.168.1.6' },
  { id: '10', created_at: 'May 31, 2024 09:50 AM', actor_name: 'Admin', action: 'Logged out', entity_type: 'Authentication', details: 'Admin logged out', ip_address: '192.168.1.1' },
];

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [userFilter, setUserFilter] = useState('All Users');
  const [moduleFilter, setModuleFilter] = useState('All Modules');

  useEffect(() => {
    try {
      (adminApi as any).auditLogs?.list()
        .then((res: any) => setLogs(Array.isArray(res) ? res : (res?.data || [])))
        .catch(() => setLogs([]))
        .finally(() => setLoading(false));
    } catch {
      setLogs([]);
      setLoading(false);
    }
  }, []);

  const display = (logs.length > 0 ? logs : fallbackLogs).filter((log: any) => {
    if (search && !log.actor_name?.toLowerCase().includes(search.toLowerCase()) && !log.action?.toLowerCase().includes(search.toLowerCase()) && !log.details?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track all system activities and changes.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        {/* Filters */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 flex-wrap">
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 focus:outline-none">
            <option>All Actions</option>
            <option>Logged in</option>
            <option>Approved Product</option>
            <option>Updated Margin</option>
            <option>Added Product</option>
            <option>Sent Notification</option>
            <option>Deleted User</option>
          </select>
          <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 focus:outline-none">
            <option>All Users</option>
            <option>Admin</option>
            <option>Warehouse</option>
            <option>Customer</option>
          </select>
          <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 focus:outline-none">
            <option>All Modules</option>
            <option>Authentication</option>
            <option>Product Approval</option>
            <option>Margin Management</option>
            <option>Notifications</option>
            <option>Customer Management</option>
          </select>
          <div className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 cursor-pointer">
            <span>May 1, 2024 – May 31, 2024</span>
            <ChevronDown style={{ width: 13, height: 13 }} />
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 transition-colors">
            <Filter style={{ width: 13, height: 13 }} /> Filter
          </button>
          <div className="ml-auto">
            <button className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 bg-white">
              <Download style={{ width: 13, height: 13 }} /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/40">
                {['Date & Time', 'User', 'Action', 'Module', 'Details', 'IP Address'].map(h => (
                  <th key={h} className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {display.map((log: any, i: number) => (
                <tr key={log.id || i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-[12px] text-gray-500 whitespace-nowrap">{log.created_at}</td>
                  <td className="px-5 py-3.5 text-[13px] font-semibold text-gray-900">{log.actor_name || log.user}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${actionColors[log.action] || 'bg-gray-100 text-gray-600'}`}>{log.action}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-600 whitespace-nowrap">{log.entity_type || log.module}</td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-600 max-w-xs truncate">{log.details}</td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-400 font-mono">{log.ip_address || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/30">
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            Show <select className="border border-gray-200 rounded px-2 py-1 text-[12px] focus:outline-none mx-1"><option>10</option><option>25</option></select> entries
          </div>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">‹</button>
            {[1,2,3].map(p => <button key={p} className={`w-7 h-7 rounded-lg text-[12px] font-semibold ${p===1?'bg-blue-600 text-white':'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>)}
            <span className="text-gray-400 text-[12px] mx-1">...</span>
            <button className="w-7 h-7 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">15</button>
            <button className="w-7 h-7 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
