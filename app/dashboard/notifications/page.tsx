'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Truck, Tag, CheckCircle, Package, AlertCircle, Trash2, Settings2, ChevronRight } from 'lucide-react';
import { useNotificationsStore } from '@/stores/notifications-store';
import { useAuth } from '@/components/auth/auth-provider';

const tabs = ['All', 'Orders', 'Promotions', 'Account', 'System', 'Inventory'] as const;

const typeIconMap: Record<string, React.ReactNode> = {
  order: <Truck style={{ width: 14, height: 14 }} />,
  product: <Package style={{ width: 14, height: 14 }} />,
  system: <AlertCircle style={{ width: 14, height: 14 }} />,
  promotion: <Tag style={{ width: 14, height: 14 }} />,
  account: <Package style={{ width: 14, height: 14 }} />,
  inventory: <Package style={{ width: 14, height: 14 }} />,
};

const typeColorMap: Record<string, string> = {
  order: 'bg-blue-50 text-blue-600',
  promotion: 'bg-orange-50 text-orange-600',
  system: 'bg-gray-100 text-gray-600',
  account: 'bg-emerald-50 text-emerald-600',
  product: 'bg-blue-50 text-blue-600',
  inventory: 'bg-amber-50 text-amber-600',
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
    } else {
      fetchNotifications({ user_id: 'usr-001', limit: 50 });
    }
  }, [user?.id, fetchNotifications]);

  const handleMarkAllRead = async () => {
    if (user?.id) await markAllAsRead(user.id);
    else await markAllAsRead('usr-001');
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const filtered = activeTab === 'All' ? notifications : notifications.filter((n) => typeTabMap[n.type] === activeTab);

  return (
    <div className="space-y-5">
      {/* Breadcrumb + Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <span className="text-gray-700 font-medium">Notifications</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Stay updated with your latest activities.</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="text-[12px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
              <CheckCircle style={{ width: 14, height: 14 }} />
              Mark all as read
            </button>
          )}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings2 style={{ width: 14, height: 14 }} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto bg-gray-50/50">
          {tabs.map((tab) => {
            const tabUnread = notifications.filter((n) => typeTabMap[n.type] === tab && !n.is_read).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-[13px] font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/60'
                }`}
              >
                {tab}
                {tab !== 'All' && tabUnread > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tabUnread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bell style={{ width: 24, height: 24 }} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-900">No notifications yet</p>
              <p className="text-[12px] text-gray-500 mt-1">You'll see updates here when they arrive.</p>
            </div>
          ) : (
            filtered.map((notif) => (
              <div
                key={notif.id}
                className={`flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors group ${!notif.is_read ? 'bg-blue-50/30' : ''}`}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${typeColorMap[notif.type] || 'bg-gray-100 text-gray-500'}`}>
                  {typeIconMap[notif.type] || <Bell style={{ width: 14, height: 14 }} />}
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
                      <p className={`text-[13px] ${!notif.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {notif.title}
                      </p>
                      <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-gray-400 whitespace-nowrap">{timeAgo(notif.created_at)}</span>
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
                  <Trash2 style={{ width: 14, height: 14 }} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
