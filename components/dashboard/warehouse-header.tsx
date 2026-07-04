'use client';

import Link from 'next/link';
import { Search, Bell, MessageSquare, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useNotificationsStore } from '@/stores/notifications-store';

export default function WarehouseHeader() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const { unreadCount } = useNotificationsStore();

  return (
    <header className="sticky top-0 z-40 h-14 bg-white border-b border-gray-100 flex-shrink-0">
      <div className="h-full px-6 flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 15, height: 15 }} />
            <input
              type="text"
              placeholder="Search anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 h-8 bg-gray-50 border border-gray-200 rounded-lg text-[13px] text-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Notifications */}
          <Link href="/warehouse/notifications">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors text-gray-500">
              <Bell style={{ width: 17, height: 17 }} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </Link>

          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors text-gray-500">
            <MessageSquare style={{ width: 17, height: 17 }} />
          </button>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* User info */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-xs font-bold text-white">{user?.name?.charAt(0).toUpperCase() || 'W'}</span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[12px] font-semibold text-gray-900 leading-tight">{user?.name || 'Warehouse Admin'}</p>
              <p className="text-[10px] text-gray-400 leading-tight">Admin</p>
            </div>
            <ChevronDown className="text-gray-400 hidden sm:block" style={{ width: 13, height: 13 }} />
          </div>
        </div>
      </div>
    </header>
  );
}
