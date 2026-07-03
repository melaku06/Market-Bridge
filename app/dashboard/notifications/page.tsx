'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Truck, Tag, CheckCircle, TrendingDown, User, ChevronRight, Package, AlertCircle, Trash2, Loader2 } from 'lucide-react';
import { useNotificationsStore } from '@/stores/notifications-store';
import { useAuth } from '@/components/auth/auth-provider';

const tabs = ['All', 'Orders', 'Promotions', 'Account', 'System', 'Inventory'] as const;

const typeIconMap: Record<string, React.ReactNode> = {
  order: <Truck className="w-4 h-4" />,
  product: <Package className="w-4 h-4" />,
  system: <AlertCircle className="w-4 h-4" />,
  promotion: <Tag className="w-4 h-4" />,
  account: <User className="w-4 h-4" />,
  inventory: <Package className="w-4 h-4" />,
};

const typeColorMap: Record<string, string> = {
  order: 'bg-blue-100 text-blue-600',
  promotion: 'bg-orange-100 text-orange-600',
  system: 'bg-gray-100 text-gray-600',
  account: 'bg-green-100 text-green-600',
  product: 'bg-purple-100 text-purple-600',
  inventory: 'bg-yellow-100 text-yellow-600',
};

const typeTabMap: Record<string, string> = {
  order: 'Orders',
  promotion: 'Promotions',
  system: 'System',
  account: 'Account',
  inventory: 'Inventory',
};

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function NotificationsPage() {
  const { user } = useAuth();
  const { notifications, unreadCount, isLoading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } = useNotificationsStore();
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('All');

  useEffect(() => {
    if (user?.id) {
      fetchNotifications({ user_id: user.id, limit: 50 });
    }
  }, [user?.id, fetchNotifications]);

  const handleMarkAllRead = async () => {
    if (user?.id) {
      await markAllAsRead(user.id);
    }
  };

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const filtered = activeTab === 'All' ? notifications : notifications.filter((n) => typeTabMap[n.type] === activeTab);

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Notifications</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              {tab !== 'All' && notifications.filter((n) => typeTabMap[n.type] === tab && !n.is_read).length > 0 && (
                <span className="ml-1.5 text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                  {notifications.filter((n) => typeTabMap[n.type] === tab && !n.is_read).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No notifications yet</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors group ${!notif.is_read ? 'bg-blue-50/30' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColorMap[notif.type] || 'bg-gray-100 text-gray-500'}`}>
                  {typeIconMap[notif.type] || <Bell className="w-4 h-4" />}
                </div>
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    if (!notif.is_read) handleMarkRead(notif.id);
                    if (notif.action_url) window.location.assign(notif.action_url);
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${!notif.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400 whitespace-nowrap">{timeAgo(notif.created_at)}</span>
                      {!notif.is_read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(notif.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
