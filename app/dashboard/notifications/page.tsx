'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Truck, Tag, CheckCircle, TrendingDown, User, ChevronRight } from 'lucide-react';
import { notificationsApi } from '@/lib/api';
import type { Notification } from '@/lib/mock-db';

const tabs = ['All', 'Orders', 'Promotions', 'Account', 'System'];

const iconMap: Record<string, React.ReactNode> = {
  truck: <Truck className="w-4 h-4" />,
  tag: <Tag className="w-4 h-4" />,
  'check-circle': <CheckCircle className="w-4 h-4" />,
  'trending-down': <TrendingDown className="w-4 h-4" />,
  user: <User className="w-4 h-4" />,
};

const typeColorMap: Record<string, string> = {
  order: 'bg-blue-100 text-blue-600',
  promotion: 'bg-orange-100 text-orange-600',
  system: 'bg-gray-100 text-gray-600',
  account: 'bg-green-100 text-green-600',
};

const typeTabMap: Record<string, string> = {
  order: 'Orders',
  promotion: 'Promotions',
  system: 'System',
  account: 'Account',
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await notificationsApi.list({ user_id: 'usr-001' });
        const notifData = Array.isArray(res) ? res : (res as { data?: Notification[] }).data || [];
        setNotifs(notifData);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const markAllRead = async () => {
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  };

  const markRead = async (id: string) => {
    setNotifs(notifs.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const filtered = activeTab === 'All' ? notifs : notifs.filter((n) => typeTabMap[n.type] === activeTab);
  const unreadCount = notifs.filter((n) => !n.read).length;

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
            <button onClick={markAllRead} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
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
                className={`flex items-start gap-4 p-5 hover:bg-gray-50/50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/30' : ''}`}
                onClick={() => markRead(notif.id)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${typeColorMap[notif.type] || 'bg-gray-100 text-gray-500'}`}>
                  {iconMap[notif.icon] || <Bell className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(notif.created_at).toLocaleDateString()}</span>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">Showing 1 to {filtered.length} of {notifs.length} notifications</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((p) => (
                <button key={p} className={`w-7 h-7 rounded-lg text-xs font-medium ${p === 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50 text-gray-700'}`}>{p}</button>
              ))}
              <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-50">›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
