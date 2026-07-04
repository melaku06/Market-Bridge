'use client';

import { Bell, Search, MessageSquare, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/auth-provider';
import { useNotificationsStore } from '@/stores/notifications/notifications-store';

export default function AdminHeader() {
  const { user } = useAuth();
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const fetchNotifications = useNotificationsStore((s) => s.fetchNotifications);

  useEffect(() => {
    if (!user?.id) return;
    fetchNotifications({ user_id: user.id });
  }, [user?.id, fetchNotifications]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-4 flex-shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 15, height: 15 }} />
          <input
            type="text"
            placeholder="Search for anything..."
            className="w-full pl-8 pr-16 h-8 bg-gray-50 border border-gray-200 rounded-lg text-[13px] text-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications */}
        <Link href="/admin/notifications">
          <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors text-gray-500">
            <Bell style={{ width: 18, height: 18 }} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </Link>

        {/* Messages */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors text-gray-500">
          <MessageSquare style={{ width: 18, height: 18 }} />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-gray-200 mx-1" />

        {/* User */}
        <div className="relative group">
          <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user?.name || 'Admin'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-blue-600">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[12px] font-semibold text-gray-900 leading-tight">{user?.name || 'Super Admin'}</p>
              <p className="text-[10px] text-gray-400 leading-tight">Administrator</p>
            </div>
            <ChevronDown className="text-gray-400 hidden sm:block" style={{ width: 14, height: 14 }} />
          </button>

          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
            <div className="p-1.5">
              <div className="px-3 py-2 border-b border-gray-100 mb-1">
                <p className="text-[12px] font-semibold text-gray-900">{user?.name || 'Super Admin'}</p>
                <p className="text-[11px] text-gray-400">{user?.email}</p>
              </div>
              <Link href="/admin/system-settings" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-[13px] text-gray-700 transition-colors">
                <Settings style={{ width: 14, height: 14 }} className="text-gray-400" /> Settings
              </Link>
              <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-[13px] text-gray-700 transition-colors">
                <LogOut style={{ width: 14, height: 14 }} className="text-gray-400" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
