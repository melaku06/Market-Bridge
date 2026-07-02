'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Heart, MapPin, Bell, Settings, Shield, Eye, Star, LogOut, ShoppingBag, HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

  return (
    <aside className="w-56 flex-shrink-0">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-20">
        {/* Profile mini */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex-shrink-0">
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100"
                alt="Sarah Johnson"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Sarah Johnson</p>
              <p className="text-xs text-gray-500 truncate">sarah.johnson@email.com</p>
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
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
                  active ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}>
                  <item.icon className={cn('w-4 h-4 flex-shrink-0', active ? 'text-blue-600' : 'text-gray-400')} />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors w-full">
              <LogOut className="w-4 h-4 text-gray-400" />
              Logout
            </button>
          </div>
        </nav>

        {/* Help Card */}
        <div className="mx-2 mb-2 p-3 bg-blue-50 rounded-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-semibold text-gray-900">Need Help?</p>
          </div>
          <p className="text-xs text-gray-500 mb-2">Our support team is here to help you.</p>
          <button className="w-full py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </aside>
  );
}
