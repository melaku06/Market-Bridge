'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Check, Trash2, X, Truck, Tag, AlertCircle, User, Package, ChevronRight } from 'lucide-react';
import { useNotificationsStore } from '@/stores/notifications-store';
import { useAuth } from '@/components/auth/auth-provider';
import { cn } from '@/lib/utils';

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
  product: 'bg-purple-100 text-purple-600',
  system: 'bg-gray-100 text-gray-600',
  promotion: 'bg-orange-100 text-orange-600',
  account: 'bg-green-100 text-green-600',
  inventory: 'bg-yellow-100 text-yellow-600',
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

export default function NotificationBell() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationsStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    if (user?.id) {
      await markAllAsRead(user.id);
    }
  };

  const handleMarkRead = async (id: string) => {
    await markAsRead(id);
  };

  const displayNotifications = notifications.slice(0, 8);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-gray-50 transition-colors text-gray-600 hover:text-blue-600 relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {displayNotifications.length === 0 ? (
              <div className="text-center py-10">
                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {displayNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      'flex items-start gap-3 p-3 hover:bg-gray-50/50 transition-colors cursor-pointer group',
                      !notif.is_read && 'bg-blue-50/30'
                    )}
                    onClick={() => {
                      if (!notif.is_read) handleMarkRead(notif.id);
                      if (notif.action_url) {
                        window.location.assign(notif.action_url);
                        setIsOpen(false);
                      }
                    }}
                  >
                    <div className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
                      typeColorMap[notif.type] || 'bg-gray-100 text-gray-500'
                    )}>
                      {typeIconMap[notif.type] || <Bell className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        'text-sm leading-snug',
                        !notif.is_read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
                      )}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{timeAgo(notif.created_at)}</p>
                    </div>
                    {!notif.is_read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100">
            <Link
              href={user?.role === 'customer' ? '/dashboard/notifications' : user?.role === 'warehouse' ? '/warehouse/notifications' : '/admin/notifications'}
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-1 py-3 text-sm text-blue-600 hover:bg-blue-50 font-medium transition-colors"
            >
              View all notifications
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
