'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Heart, MapPin, Bell, Settings, Shield, Eye, Star, LogOut, Truck, ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/auth-provider';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/dashboard/orders', icon: Package, label: 'My Orders' },
  { href: '/dashboard/order-tracking', icon: Truck, label: 'Order Tracking' },
  { href: '/wishlist', icon: Heart, label: 'Wishlist' },
  { href: '/dashboard/addresses', icon: MapPin, label: 'Saved Addresses' },
  { href: '/dashboard/notifications', icon: Bell, label: 'Notifications', badge: 3 },
  { href: '/dashboard/profile', icon: Settings, label: 'Profile Settings' },
  { href: '/dashboard/security', icon: Shield, label: 'Account Security' },
  { href: '/dashboard/recently-viewed', icon: Eye, label: 'Recently Viewed' },
  { href: '/dashboard/reviews', icon: Star, label: 'Review History' },
];

export default function CustomerSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  };

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-20">
        {/* Logo */}
        <div className="px-4 py-3.5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
              <ShoppingBag className="text-white" style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">MarketBridge</p>
              <p className="text-[10px] text-gray-400 leading-tight">My Account</p>
            </div>
          </Link>
        </div>

        {/* Profile */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-blue-100">
              <img
                src={user?.avatar_url || "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"}
                alt={user?.name || "User"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-gray-900 truncate leading-tight">
                {user?.name?.split(' ')[0] || 'User'}
              </p>
              <span className="inline-block text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full font-medium leading-tight">
                Customer
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-2 space-y-0.5">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150',
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}>
                  <item.icon
                    className={cn('flex-shrink-0', active ? 'text-white' : 'text-gray-400')}
                    style={{ width: 16, height: 16 }}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      'min-w-[18px] h-[18px] text-[10px] rounded-full flex items-center justify-center font-semibold px-1',
                      active ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-2 border-t border-gray-100 mt-1 pt-1">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all w-full"
          >
            <LogOut className="text-gray-400 flex-shrink-0" style={{ width: 16, height: 16 }} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
