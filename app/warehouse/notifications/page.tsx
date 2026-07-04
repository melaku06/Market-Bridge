'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Bell, Package, AlertTriangle, Tag, Info, CheckCircle2, Trash2, Check, HelpCircle } from 'lucide-react';
import { useNotificationsStore } from '@/stores/notifications-store';
import { useAuth } from '@/components/auth/auth-provider';
import type { Notification } from '@/lib/types';
import { useRouter } from 'next/navigation';

const TABS = ['All', 'Unread', 'Orders', 'Inventory', 'System', 'Promotions'] as const;
type Tab = typeof TABS[number];

const TYPE_MAP: Record<string, Tab> = {
  order: 'Orders', orders: 'Orders',
  inventory: 'Inventory', stock: 'Inventory',
  system: 'System',
  promotion: 'Promotions', promotional: 'Promotions',
};

const TYPE_ICON: Record<string, { icon: any; bg: string; color: string }> = {
  order: { icon: Package, bg: 'bg-blue-50', color: 'text-blue-500' },
  orders: { icon: Package, bg: 'bg-blue-50', color: 'text-blue-500' },
  inventory: { icon: AlertTriangle, bg: 'bg-amber-50', color: 'text-amber-500' },
  stock: { icon: AlertTriangle, bg: 'bg-amber-50', color: 'text-amber-500' },
  system: { icon: Info, bg: 'bg-purple-50', color: 'text-purple-500' },
  promotion: { icon: Tag, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  promotional: { icon: Tag, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  default: { icon: Bell, bg: 'bg-gray-50', color: 'text-gray-500' },
};

const PREFS = [
  { key: 'new_orders', label: 'New Order Received' },
  { key: 'low_stock', label: 'Low Stock Alerts' },
  { key: 'payment', label: 'Payment Received' },
  { key: 'promotions', label: 'Promotional Offers' },
  { key: 'system', label: 'System Updates' },
  { key: 'weekly', label: 'Weekly Summary' },
];

function timeAgo(date: string | undefined) {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'Just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} type="button"
      style={{ width: 40, height: 22, background: on ? '#7c3aed' : '#e5e7eb', borderRadius: 20, position: 'relative', transition: 'background 0.2s', border: 'none', cursor: 'pointer' }}>
      <span style={{ position: 'absolute', top: 2, left: on ? 20 : 2, width: 18, height: 18, background: '#fff', borderRadius: '50%', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
    </button>
  );
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationsStore();
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [prefs, setPrefs] = useState<Record<string, boolean>>(Object.fromEntries(PREFS.map(p => [p.key, true])));

  useEffect(() => {
    if (user?.id) fetchNotifications({ user_id: user.id, limit: 50 });
  }, [user?.id]);

  const getTab = (n: Notification): Tab => {
    const t = n.type?.toLowerCase() || '';
    for (const [key, tab] of Object.entries(TYPE_MAP)) {
      if (t.includes(key)) return tab;
    }
    return 'System';
  };

  const filtered = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.read && !(n as any).is_read;
    return getTab(n) === activeTab;
  });

  const tabCount = (tab: Tab) => {
    if (tab === 'All') return notifications.length;
    if (tab === 'Unread') return notifications.filter(n => !n.read && !(n as any).is_read).length;
    return notifications.filter(n => getTab(n) === tab).length;
  };

  const handleNotifClick = async (n: Notification) => {
    if (!n.read && !(n as any).is_read) await markAsRead(n.id);
    if ((n as any).action_url) router.push((n as any).action_url);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up'}
          </p>
        </div>
        <button onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Check style={{ width: 13, height: 13 }} /> Mark all as read
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        {/* Notifications List */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-4 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-3 py-4 text-[13px] font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {tab}
                {tabCount(tab) > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                    {tabCount(tab)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="divide-y divide-gray-50">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-7 h-7 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-gray-300">
                <Bell style={{ width: 36, height: 36 }} />
                <p className="text-sm mt-2 text-gray-400">No notifications</p>
              </div>
            ) : filtered.map(n => {
              const isUnread = !n.read && !(n as any).is_read;
              const typeKey = n.type?.toLowerCase() || 'default';
              const iconConfig = TYPE_ICON[typeKey] || TYPE_ICON.default;
              const Icon = iconConfig.icon;
              return (
                <div key={n.id}
                  onClick={() => handleNotifClick(n)}
                  className={`relative flex items-start gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors cursor-pointer group ${isUnread ? 'bg-purple-50/20' : ''}`}
                >
                  {isUnread && <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-600" />}
                  <div className={`w-9 h-9 rounded-xl ${iconConfig.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={iconConfig.color} style={{ width: 16, height: 16 }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] text-gray-400 whitespace-nowrap">{timeAgo((n as any).created_at)}</span>
                        <button
                          onClick={e => { e.stopPropagation(); deleteNotification(n.id); }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 style={{ width: 13, height: 13 }} />
                        </button>
                      </div>
                    </div>
                    {isUnread && (
                      <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full mt-1 inline-block">New</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">
          {/* Preferences */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-3.5">
              {PREFS.map(p => (
                <div key={p.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{p.label}</span>
                  <Toggle on={prefs[p.key]} onToggle={() => setPrefs(prev => ({ ...prev, [p.key]: !prev[p.key] }))} />
                </div>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <HelpCircle className="text-white" style={{ width: 16, height: 16 }} />
              </div>
              <h3 className="text-sm font-bold">Need Help?</h3>
            </div>
            <p className="text-xs text-white/80 mb-4">Contact our support team for any questions or issues.</p>
            <button className="w-full bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-xl text-xs font-semibold">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
