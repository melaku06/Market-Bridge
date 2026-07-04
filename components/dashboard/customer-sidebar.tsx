'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Heart, MapPin, Bell, Settings, Shield, Eye, Star, LogOut, ShoppingBag, HelpCircle, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/auth-provider';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/orders', icon: Package, label: 'My Orders' },
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

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden sticky top-20 shadow-sm">
        {/* Profile mini */}
        <div className="p-5 border-b border-gray-100 bg-gradient-to-br from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex-shrink-0 ring-2 ring-indigo-100">
              <img
                src={user?.avatar_url || "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"}
                alt={user?.name || "User"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="p-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 mb-0.5 group',
                  active
                    ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}>
                  <item.icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-white' : 'text-gray-400 group-hover:text-indigo-500')} />
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={cn(
                      'min-w-[20px] h-5 text-xs rounded-full flex items-center justify-center font-medium px-1.5',
                      active ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-600'
                    )}>
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="w-4 h-4 opacity-60" />}
                </div>
              </Link>
            );
          })}

          <div className="border-t border-gray-100 mt-3 pt-2">
            <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full group">
              <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>

        {/* Help Card */}
        <div className="mx-2 mb-2 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Need Help?</p>
          </div>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">Our support team is here to help you 24/7.</p>
          <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-medium rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
}
