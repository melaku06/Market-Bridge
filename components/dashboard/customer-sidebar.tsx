'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Heart, MapPin, Bell, Settings, Shield, Eye, Star, LogOut, HelpCircle, Truck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/auth-provider';
import { SidebarIcon } from '@/components/ui/market-bridge-logo';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
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
    <aside className="w-64 flex-shrink-0">
      <div className="rounded-2xl overflow-hidden sticky top-20 shadow-lg" style={{ background: '#0f1d35' }}>
        {/* Logo */}
        <div className="px-5 py-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <SidebarIcon />
            <span className="font-bold text-xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">MarketBridge</span>
          </Link>
        </div>

        {/* Profile */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-blue-400/40">
              <img
                src={user?.avatar_url || "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"}
                alt={user?.name || "User"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Hello, {user?.name?.split(' ')[0] || 'User'}!
              </p>
              <span className="inline-block text-[10px] px-2 py-0.5 bg-blue-500/30 text-blue-300 rounded-full font-medium">
                {user?.role === 'customer' ? 'Customer' : user?.role || 'Customer'}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-3">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href) && item.href !== '/wishlist');
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 mb-0.5 group',
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:bg-white/8 hover:text-white'
                )} style={!active ? { '--tw-hover-bg': 'rgba(255,255,255,0.08)' } as React.CSSProperties : {}}>
                  <item.icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-white' : 'text-gray-500 group-hover:text-gray-300')} />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      'min-w-[20px] h-5 text-[10px] rounded-full flex items-center justify-center font-medium px-1.5',
                      active ? 'bg-white/20 text-white' : 'bg-blue-500/30 text-blue-300'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          <div className="border-t border-white/10 mt-3 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150 w-full group"
            >
              <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>

        {/* Help Card */}
        <div className="mx-3 mb-3 p-4 rounded-xl border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/30 flex items-center justify-center">
              <HelpCircle className="w-3.5 h-3.5 text-blue-300" />
            </div>
            <p className="text-sm font-semibold text-white">Need Help?</p>
          </div>
          <p className="text-xs text-gray-400 mb-3 leading-relaxed">Our support team is here to help you 24/7.</p>
          <button className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
}
