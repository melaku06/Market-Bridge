'use client';

import { useState } from 'react';
import { Search, Bell, MessageSquare, ChevronDown, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useNotificationsStore } from '@/stores/notifications-store';
import Link from 'next/link';

export default function WarehouseHeader() {
  const { user } = useAuth();
  const { unreadCount } = useNotificationsStore();
  const [userOpen, setUserOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/login';
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 flex-shrink-0 sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 16, height: 16 }} />
          <input
            type="text"
            placeholder="Search anything..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 ml-auto">
        {/* Notification Bell */}
        <Link href="/warehouse/notifications">
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <Bell style={{ width: 18, height: 18 }} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </Link>

        {/* Messages */}
        <button className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
          <MessageSquare style={{ width: 18, height: 18 }} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 mx-2" />

        {/* User */}
        <div className="relative">
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-2.5 pl-1 pr-2 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-purple-600">
                {user?.name?.charAt(0).toUpperCase() || 'W'}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 leading-none">{user?.name || 'Warehouse One'}</p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{user?.role || 'Admin'}</p>
            </div>
            <ChevronDown className="text-gray-400 hidden sm:block" style={{ width: 14, height: 14 }} />
          </button>

          {userOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <Link href="/warehouse/profile" onClick={() => setUserOpen(false)}>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <User style={{ width: 15, height: 15 }} className="text-gray-400" />
                      Profile
                    </button>
                  </Link>
                  <Link href="/warehouse/settings" onClick={() => setUserOpen(false)}>
                    <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings style={{ width: 15, height: 15 }} className="text-gray-400" />
                      Settings
                    </button>
                  </Link>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut style={{ width: 15, height: 15 }} />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
