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
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-100 flex-shrink-0 shadow-sm">
      <div className="h-full px-6 flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 14, height: 14 }} />
            <input
              type="text"
              placeholder="Search anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 h-9 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-600 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
        </div>

        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Link href="/warehouse/notifications">
            <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors text-gray-500">
              <Bell style={{ width: 16, height: 16 }} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </button>
          </Link>

          <button className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors text-gray-500">
            <MessageSquare style={{ width: 16, height: 16 }} />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* User */}
          <button className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }}>
              {user?.avatar_url
                ? <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover rounded-full" />
                : user?.name?.charAt(0).toUpperCase() || 'W'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[12px] font-semibold text-gray-900 leading-tight">{user?.name || 'Warehouse Admin'}</p>
              <p className="text-[10px] text-gray-400 leading-tight capitalize">{user?.role || 'Admin'}</p>
            </div>
            <ChevronDown className="text-gray-400 hidden sm:block" style={{ width: 12, height: 12 }} />
          </button>
        </div>
      </div>
    </header>
  );
}
