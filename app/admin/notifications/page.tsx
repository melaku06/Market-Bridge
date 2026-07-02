'use client';

import { useEffect, useState } from 'react';
import { Bell, Package, AlertTriangle, Tag, CheckCircle, Trash2, Plus } from 'lucide-react';
import { notificationsApi, usersApi } from '@/lib/api';
import type { Notification, User } from '@/lib/mock-db';

type UserWithoutPassword = Omit<User, 'password_hash'>;

const iconMap: Record<string, React.ReactNode> = {
  'truck': <Package className="w-5 h-5" />,
  'alert-triangle': <AlertTriangle className="w-5 h-5" />,
  'tag': <Tag className="w-5 h-5" />,
  'check-circle': <CheckCircle className="w-5 h-5" />,
  'bell': <Bell className="w-5 h-5" />,
};

export default function AdminNotifications() {
  const [admin, setAdmin] = useState<UserWithoutPassword | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newNotif, setNewNotif] = useState({ title: '', message: '', type: 'system', priority: 'medium' });

  useEffect(() => {
    async function fetchData() {
      try {
        const usersRes = await usersApi.list({ role: 'admin' });
        const adminUser = usersRes.data[0];
        setAdmin(adminUser);

        if (adminUser) {
          const notifRes = await notificationsApi.list({ user_id: adminUser.id });
          setNotifications(notifRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await notificationsApi.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleSend = async () => {
    if (newNotif.title && newNotif.message) {
      try {
        const usersRes = await usersApi.list({ role: 'customer' });
        const customers = usersRes.data;

        for (const user of customers) {
          await notificationsApi.create({
            user_id: user.id,
            title: newNotif.title,
            message: newNotif.message,
            type: newNotif.type as Notification['type'],
            icon: 'bell',
            priority: newNotif.priority as Notification['priority'],
          });
        }

        if (admin) {
          const adminNotif = await notificationsApi.create({
            user_id: admin.id,
            title: `Sent: ${newNotif.title}`,
            message: `Notification sent to ${customers.length} users`,
            type: 'system',
            icon: 'check-circle',
            priority: 'low',
          });
          setNotifications([adminNotif, ...notifications]);
        }

        setShowForm(false);
        setNewNotif({ title: '', message: '', type: 'system', priority: 'medium' });
      } catch (error) {
        console.error('Failed to send notifications:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500">Admin notifications center</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Send Notification
        </button>
      </div>

      {/* Send Notification Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Send Notification to All Users</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newNotif.title}
                onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notification title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                value={newNotif.message}
                onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Notification message"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newNotif.type}
                  onChange={(e) => setNewNotif({ ...newNotif, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="system">System</option>
                  <option value="promotion">Promotion</option>
                  <option value="account">Account</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newNotif.priority}
                  onChange={(e) => setNewNotif({ ...newNotif, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleSend}
              className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Send to All Users
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                notification.type === 'order' ? 'bg-blue-100 text-blue-600' :
                notification.type === 'inventory' ? 'bg-yellow-100 text-yellow-600' :
                notification.type === 'product' ? 'bg-purple-100 text-purple-600' :
                'bg-gray-100 text-gray-600'
              }`}>
                {iconMap[notification.icon] || <Bell className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{notification.title}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{notification.message}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No notifications</p>
        </div>
      )}
    </div>
  );
}
