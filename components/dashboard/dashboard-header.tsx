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
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D946EF 0%, #8B5CF6 50%, #38BDF8 100%)' }}>
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">MarketBridge</span>
          </Link>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-9 pr-4 h-9 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 ml-auto">
            {/* Mobile search */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link href="/dashboard/orders">
              <button className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-violet-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Notifications */}
            <Link href="/dashboard/notifications">
              <button className="relative p-2 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </Link>

            {/* User dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-violet-100 flex items-center justify-center flex-shrink-0">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-violet-600">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900 hidden sm:block">{user?.name?.split(' ')[0] || 'User'}</span>
                <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
              </button>

              <div className="absolute top-full right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link href="/dashboard/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-violet-50 hover:text-violet-600 text-sm text-gray-700 transition-colors">
                    <Settings className="w-4 h-4" /> Profile Settings
                  </Link>
                  <Link href="/dashboard/orders" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 text-sm text-gray-700 transition-colors">
                    <Package className="w-4 h-4" /> My Orders
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-sm text-gray-700 transition-colors">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
