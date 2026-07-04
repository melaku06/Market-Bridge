'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import {
  Bell, Truck, Tag, Package, AlertCircle, User, Trash2, Loader2, Settings2, CheckSquare,
  ShoppingCart, ToggleLeft, ToggleRight, Phone, Mail, MessageSquare, Megaphone
} from 'lucide-react';
import { useNotificationsStore } from '@/stores/notifications/notifications-store';
import { useAuth } from '@/components/auth/auth-provider';

const tabs = ['All', 'Unread', 'Orders', 'Inventory', 'System', 'Promotions'] as const;

const typeIconMap: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
  order: { icon: <ShoppingCart className="w-4 h-4" />, bg: 'bg-blue-50', text: 'text-blue-600' },
  product: { icon: <Package className="w-4 h-4" />, bg: 'bg-purple-50', text: 'text-purple-600' },
  system: { icon: <Settings2 className="w-4 h-4" />, bg: 'bg-gray-100', text: 'text-gray-600' },
  promotion: { icon: <Megaphone className="w-4 h-4" />, bg: 'bg-orange-50', text: 'text-orange-600' },
  account: { icon: <User className="w-4 h-4" />, bg: 'bg-emerald-50', text: 'text-emerald-600' },
  inventory: { icon: <AlertCircle className="w-4 h-4" />, bg: 'bg-amber-50', text: 'text-amber-600' },
};

const typeBadgeMap: Record<string, string> = {
  order: 'bg-blue-100 text-blue-700',
  product: 'bg-purple-100 text-purple-700',
  system: 'bg-gray-100 text-gray-600',
  promotion: 'bg-orange-100 text-orange-700',
  account: 'bg-emerald-100 text-emerald-700',
  inventory: 'bg-amber-100 text-amber-700',
};

const typeTabMap: Record<string, string> = {
  order: 'Orders', product: 'Products', inventory: 'Inventory', system: 'System', promotion: 'Promotions',
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
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

export default function WarehouseNotifications() {
  const { user } = useAuth();
  const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationsStore();
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('All');
  const [notifPrefs, setNotifPrefs] = useState({
    newOrders: true,
    orderUpdates: true,
    lowStockAlerts: true,
    payments: true,
    systemUpdates: true,
    promotions: false,
  });

  useEffect(() => {
    if (user?.id) {
      fetchNotifications({ user_id: user.id, limit: 50 });
    }
  }, [user?.id, fetchNotifications]);

  const filtered = notifications.filter(n => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Unread') return !n.is_read;
    return typeTabMap[n.type] === activeTab;
  });

  const getTabCount = (tab: string) => {
    if (tab === 'All') return notifications.length;
    if (tab === 'Unread') return notifications.filter(n => !n.is_read).length;
    return notifications.filter(n => typeTabMap[n.type] === tab).length;
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative rounded-full transition-colors flex-shrink-0`}
      style={{ width: 40, height: 22, backgroundColor: checked ? '#10b981' : '#d1d5db' }}
    >
      <span
        className="absolute top-0.5 left-0.5 bg-white rounded-full shadow-sm transition-transform"
        style={{ width: 18, height: 18, transform: checked ? 'translateX(18px)' : 'translateX(0)' }}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-0.5">Stay updated with your warehouse activities.</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={() => user?.id && markAllAsRead(user.id)}
              className="flex items-center gap-1.5 text-sm text-purple-600 font-medium px-3 py-2 rounded-xl hover:bg-purple-50 border border-purple-200 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              Mark all as read
            </button>
          )}
          <button className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex gap-5">
        {/* Left - Notification List */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map(tab => {
              const count = getTabCount(tab);
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-purple-600 text-purple-600 bg-purple-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
                  }`}
                >
                  {tab}
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notifications */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Bell className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No notifications</p>
              <p className="text-xs text-gray-400 mt-1">You'll see updates here when they arrive.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(notif => {
                const iconInfo = typeIconMap[notif.type] || { icon: <Bell className="w-4 h-4" />, bg: 'bg-gray-100', text: 'text-gray-500' };
                return (
                  <div
                    key={notif.id}
                    className={`flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors group ${!notif.is_read ? 'bg-purple-50/20' : ''}`}
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconInfo.bg} ${iconInfo.text}`}>
                      {iconInfo.icon}
                    </div>

                    {/* Content */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => {
                        if (!notif.is_read) markAsRead(notif.id);
                        if (notif.action_url) window.location.assign(notif.action_url);
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notif.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                            {notif.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeBadgeMap[notif.type] || 'bg-gray-100 text-gray-500'} capitalize`}>
                            {notif.type}
                          </span>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">{timeAgo(notif.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {!notif.is_read && (
                        <div className="w-2 h-2 rounded-full bg-purple-600" />
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
              <p className="text-xs text-gray-500">
                Showing <span className="font-semibold text-gray-700">1 to {Math.min(8, filtered.length)}</span> of <span className="font-semibold text-gray-700">{filtered.length}</span> notifications
              </p>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">‹</button>
                <button className="w-7 h-7 rounded-lg text-xs font-semibold bg-purple-600 text-white">1</button>
                <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">2</button>
                <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">›</button>
              </div>
            </div>
          )}
        </div>

        {/* Right - Preferences + Support */}
        <div className="w-64 flex-shrink-0 space-y-4">
          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Notification Preferences</h3>
            <p className="text-xs text-gray-400 mb-4">Choose what you want to be notified about</p>
            <div className="space-y-3.5">
              {[
                { label: 'New Orders', key: 'newOrders' },
                { label: 'Order Updates', key: 'orderUpdates' },
                { label: 'Low Stock Alerts', key: 'lowStockAlerts' },
                { label: 'Payments', key: 'payments' },
                { label: 'System Updates', key: 'systemUpdates' },
                { label: 'Promotions', key: 'promotions' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <Toggle
                    checked={notifPrefs[item.key as keyof typeof notifPrefs]}
                    onChange={() => setNotifPrefs(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof notifPrefs] }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-5 text-white">
            <h3 className="font-semibold text-sm mb-1">Need Help?</h3>
            <p className="text-xs text-purple-200 mb-4 leading-relaxed">
              If you need any assistance, our support team is here to help you.
            </p>
            <button className="w-full py-2.5 bg-white text-purple-700 rounded-xl text-sm font-semibold hover:bg-purple-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
