'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Truck, Tag, CheckCircle, Package, AlertCircle, User, Trash2, Loader2, ChevronRight, Settings2, ShoppingCart, TrendingUp } from 'lucide-react';
import { useNotificationsStore } from '@/stores/notifications-store';
import { useAuth } from '@/components/auth/auth-provider';

const tabs = ['All', 'Unread', 'Orders', 'Inventory', 'System', 'Promotions'] as const;

const typeIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  order: ShoppingCart,
  product: Package,
  system: AlertCircle,
  promotion: Tag,
  account: User,
  inventory: Package,
};

const typeColorMap: Record<string, string> = {
  order: 'bg-blue-50 text-blue-600',
  promotion: 'bg-orange-50 text-orange-600',
  system: 'bg-gray-100 text-gray-600',
  account: 'bg-emerald-50 text-emerald-600',
  product: 'bg-cyan-50 text-cyan-600',
  inventory: 'bg-amber-50 text-amber-600',
};

const typeTabMap: Record<string, string> = {
  order: 'Orders', product: 'Inventory', inventory: 'Inventory', system: 'System', promotion: 'Promotions',
};

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

const prefItems = [
  { key: 'new_orders', label: 'New Orders' },
  { key: 'order_updates', label: 'Order Updates' },
  { key: 'low_stock', label: 'Low Stock Alerts' },
  { key: 'payments', label: 'Payments' },
  { key: 'system_updates', label: 'System Updates' },
  { key: 'promotions', label: 'Promotions' },
];

export default function WarehouseNotifications() {
  const { user } = useAuth();
  const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationsStore();
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('All');
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    new_orders: true, order_updates: true, low_stock: true, payments: true, system_updates: true, promotions: false,
  });

  useEffect(() => {
    if (user?.id) {
      fetchNotifications({ user_id: user.id, limit: 50 });
    }
  }, [user?.id, fetchNotifications]);

  const filtered = notifications.filter((n) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.is_read;
    return typeTabMap[n.type] === activeTab;
  });

  const getTabCount = (tab: string) => {
    if (tab === 'All') return notifications.length;
    if (tab === 'Unread') return notifications.filter(n => !n.is_read).length;
    return notifications.filter(n => typeTabMap[n.type] === tab).length;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/warehouse" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Notifications</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">Stay updated with your warehouse activities.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => user?.id && markAllAsRead(user.id)}
            className="text-sm text-blue-600 border border-blue-200 hover:bg-blue-50 font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex gap-5">
        {/* Notifications List */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map((tab) => {
              const count = getTabCount(tab);
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 flex-shrink-0 ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((notif) => {
                const IconComp = typeIconMap[notif.type] || Bell;
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-4 p-4 hover:bg-gray-50/50 transition-colors group ${!notif.is_read ? 'bg-blue-50/20' : ''}`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColorMap[notif.type] || 'bg-gray-100 text-gray-500'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => {
                        if (!notif.is_read) markAsRead(notif.id);
                        if (notif.action_url) window.location.assign(notif.action_url);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm ${!notif.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {notif.title}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(notif.created_at)}</span>
                          {!notif.is_read && <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                    </div>
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-100 text-center text-xs text-gray-500">
              Showing 1 to {filtered.length} of {notifications.length} notifications
              <button className="ml-2 text-blue-600 font-medium hover:underline">Load more</button>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-64 flex-shrink-0 space-y-4">
          {/* Notification Preferences */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-sm">Notification Preferences</h3>
              <Settings2 className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mb-4">Choose what you want to be notified about.</p>
            <div className="space-y-3">
              {prefItems.map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <button
                    onClick={() => setPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}
                    className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${prefs[item.key] ? 'bg-blue-600' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${prefs[item.key] ? 'right-0.5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">Need Help?</h3>
                <p className="text-xs text-gray-500 mt-0.5">If you need any assistance, our support team is here to help you.</p>
              </div>
            </div>
            <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
