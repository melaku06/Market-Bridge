'use client';

import Link from 'next/link';
import { Search, Bell, ShoppingCart, ShoppingBag, ChevronDown, Settings, LogOut, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import { notificationsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import { useCartStore } from '@/stores/cart-store';

export default function DashboardHeader() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const cartCount = useCartStore((s) => s.totalItems());

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  };

  useEffect(() => {
    async function fetchUnreadCount() {
      if (!user?.id) return;
      try {
        const res = await notificationsApi.list({ user_id: user.id });
        const notifications = Array.isArray(res) ? res : (res as { data?: { read: boolean }[] }).data || [];
        setUnreadCount(notifications.filter((n: { read: boolean }) => !n.read).length);
      } catch {
        // ignore
      }
    }
    fetchUnreadCount();
  }, [user?.id]);

  return (
    <header className="sticky top-0 z-50 h-14 bg-white border-b border-gray-100 flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            <ShoppingBag className="text-white" style={{ width: 18, height: 18 }} />
          </div>
          <span className="font-bold text-gray-900 text-sm hidden sm:block">MarketBridge</span>
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 15, height: 15 }} />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-8 pr-16 h-8 bg-gray-50 border border-gray-200 rounded-lg text-[13px] text-gray-600 placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 ml-auto">
          {/* Cart */}
          <Link href="/dashboard/orders">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors text-gray-500">
              <ShoppingCart style={{ width: 18, height: 18 }} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>
          </Link>

          {/* Notifications */}
          <Link href="/dashboard/notifications">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-50 transition-colors text-gray-500">
              <Bell style={{ width: 18, height: 18 }} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </Link>

          {/* Divider */}
          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* User dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-blue-600">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-[12px] font-semibold text-gray-900 leading-tight">{user?.name?.split(' ')[0] || 'User'}</p>
                <p className="text-[10px] text-gray-400 leading-tight">Customer</p>
              </div>
              <ChevronDown className="text-gray-400 hidden sm:block" style={{ width: 14, height: 14 }} />
            </button>

            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="p-1.5">
                <div className="px-3 py-2 border-b border-gray-100 mb-1">
                  <p className="text-[12px] font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-gray-400">{user?.email}</p>
                </div>
                <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-[13px] text-gray-700 transition-colors">
                  <Settings style={{ width: 14, height: 14 }} className="text-gray-400" /> Profile Settings
                </Link>
                <Link href="/dashboard/orders" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-[13px] text-gray-700 transition-colors">
                  <Package style={{ width: 14, height: 14 }} className="text-gray-400" /> My Orders
                </Link>
                <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-[13px] text-gray-700 transition-colors">
                  <LogOut style={{ width: 14, height: 14 }} className="text-gray-400" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
