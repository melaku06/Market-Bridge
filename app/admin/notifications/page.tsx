'use client';

import { useEffect, useState } from 'react';
import { Bell, Package, AlertTriangle, Tag, CheckCircle, Trash2, Plus, Search, Eye, Edit, MoreVertical } from 'lucide-react';
import { notificationsApi, usersApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import { useNotificationsStore } from '@/stores/notifications/notifications-store';

const statusBadge: Record<string, string> = {
  sent:      'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  scheduled: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  draft:     'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
};

const typeBadge: Record<string, string> = {
  promotion: 'bg-violet-50 text-violet-700',
  system:    'bg-blue-50 text-blue-700',
  update:    'bg-cyan-50 text-cyan-700',
};

const fallbackNotifications = [
  { id: '1', title: 'Weekend Mega Sale', type: 'promotion', audience: 'All Users', status: 'sent', sent_at: 'May 31, 2024, 10:30 AM' },
  { id: '2', title: 'System Maintenance', type: 'system', audience: 'All Users', status: 'scheduled', sent_at: 'Jun 02, 2024, 02:00 AM' },
  { id: '3', title: 'New Features Update', type: 'update', audience: 'All Users', status: 'sent', sent_at: 'May 26, 2024, 09:00 AM' },
  { id: '4', title: 'Ed Special Discounts', type: 'promotion', audience: 'All Users', status: 'sent', sent_at: 'May 25, 2024, 08:00 AM' },
  { id: '5', title: 'Payment Gateway Update', type: 'system', audience: 'All Users', status: 'sent', sent_at: 'May 22, 2024, 11:15 AM' },
  { id: '6', title: 'New Warehouse Added', type: 'update', audience: 'Warehouse Users', status: 'sent', sent_at: 'May 25, 2024, 03:00 PM' },
  { id: '7', title: 'Terms & Conditions Update', type: 'system', audience: 'All Users', status: 'scheduled', sent_at: 'Jun 05, 2024, 12:00 PM' },
  { id: '8', title: 'Holiday Notice', type: 'system', audience: 'All Users', status: 'sent', sent_at: 'May 18, 2024, 10:00 AM' },
  { id: '9', title: 'App Maintenance', type: 'system', audience: 'All Users', status: 'draft', sent_at: '—' },
];

export default function AdminNotifications() {
  const { user } = useAuth();
  const { notifications, isLoading, fetchNotifications } = useNotificationsStore();
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'system' as 'order' | 'product' | 'system' | 'promotion' | 'account' | 'inventory', priority: 'medium' });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNotifications(user?.id ? { user_id: user.id } : {});
  }, [user?.id, fetchNotifications]);

  const handleSend = async () => {
    if (!form.title || !form.message) return;
    setSending(true);
    try {
      const usersRes = await usersApi.list({ role: 'customer' });
      const allUsers = Array.isArray(usersRes) ? usersRes : (usersRes as any).data || [];
      await Promise.all(allUsers.slice(0, 50).map((u: any) =>
        notificationsApi.create({ user_id: u.id, title: form.title, message: form.message, type: form.type })
      ));
      setForm({ title: '', message: '', type: 'system', priority: 'medium' });
      setShowCreateForm(false);
    } catch (e) { console.error(e); }
    finally { setSending(false); }
  };

  const displayNotifications = notifications.length > 0 ? notifications : fallbackNotifications;
  const filtered = activeTab === 'all' ? displayNotifications
    : activeTab === 'scheduled' ? displayNotifications.filter((n: any) => n.status === 'scheduled')
    : activeTab === 'sent' ? displayNotifications.filter((n: any) => n.status === 'sent')
    : displayNotifications.filter((n: any) => n.status === 'draft');

  if (isLoading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">System Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">Create, manage and send system-wide notifications.</p>
        </div>
        <button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition-colors">
          <Plus style={{ width: 14, height: 14 }} /> Create Notification
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Create New Notification</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-[12px] font-semibold text-gray-700 mb-1">Title</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400" placeholder="Notification title" />
            </div>
            <div className="col-span-2">
              <label className="block text-[12px] font-semibold text-gray-700 mb-1">Message</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:border-blue-400 resize-none" placeholder="Notification message" />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none bg-white">
                <option value="system">System</option>
                <option value="promotion">Promotion</option>
                <option value="order">Order</option>
                <option value="product">Product</option>
                <option value="account">Account</option>
                <option value="inventory">Inventory</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-gray-700 mb-1">Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none bg-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setShowCreateForm(false)} className="px-3.5 py-2 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
            <button onClick={handleSend} disabled={sending} className="px-3.5 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 disabled:opacity-50">
              {sending ? 'Sending...' : 'Send to All Users'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex gap-1">
            {[
              { key: 'all', label: 'All Notifications' },
              { key: 'scheduled', label: 'Scheduled' },
              { key: 'sent', label: 'Sent' },
              { key: 'draft', label: 'Drafts' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors ${activeTab === tab.key ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[12px] text-gray-500">
            Show <select className="border border-gray-200 rounded-lg px-2 py-1 text-[12px] bg-white focus:outline-none"><option>10</option><option>25</option><option>50</option></select> entries
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/40">
                {['Title', 'Type', 'Audience', 'Status', 'Sent At', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((n: any, i: number) => (
                <tr key={n.id || i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-[13px] font-semibold text-gray-900">{n.title}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${typeBadge[n.type] || typeBadge.system}`}>{n.type || 'System'}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-gray-600">{n.audience || 'All Users'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadge[n.status || 'sent'] || statusBadge.sent}`}>{n.status || 'Sent'}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[12px] text-gray-500">{n.sent_at || (n.created_at ? new Date(n.created_at).toLocaleString() : '—')}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Eye style={{ width: 13, height: 13 }} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Edit style={{ width: 13, height: 13 }} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 style={{ width: 13, height: 13 }} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="py-12 text-center text-[13px] text-gray-400">No notifications found</div>}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/30">
          <p className="text-[12px] text-gray-500">Showing 1 to {Math.min(filtered.length, 10)} of {filtered.length} entries</p>
          <div className="flex items-center gap-1">
            {[1,2,3].map(p => <button key={p} className={`w-7 h-7 rounded-lg text-[12px] font-semibold ${p===1?'bg-blue-600 text-white':'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>)}
            <span className="text-gray-400 text-[12px] mx-1">...</span>
            <button className="w-7 h-7 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">8</button>
          </div>
        </div>
      </div>
    </div>
  );
}
