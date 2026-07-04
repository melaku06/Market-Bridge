'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Warehouse,
  ShoppingCart,
  BarChart3,
  User,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/auth-provider';
import { useNotificationsStore } from '@/stores/notifications-store';

const navigation = [
  { name: 'Dashboard', href: '/warehouse', icon: LayoutDashboard },
  { name: 'Products', href: '/warehouse/products', icon: Package },
  { name: 'Add Product', href: '/warehouse/products/add', icon: PlusCircle },
  { name: 'Inventory', href: '/warehouse/inventory', icon: Warehouse },
  { name: 'Orders', href: '/warehouse/orders', icon: ShoppingCart },
  { name: 'Analytics', href: '/warehouse/analytics', icon: BarChart3 },
  { name: 'Notifications', href: '/warehouse/notifications', icon: Bell, badge: true },
  { name: 'Profile', href: '/warehouse/profile', icon: User },
  { name: 'Settings', href: '/warehouse/settings', icon: Settings },
];

export default function WarehouseSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { unreadCount } = useNotificationsStore();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  };

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 shadow-sm">
      {/* Logo */}
      <div className="h-16 px-5 flex items-center border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }}>
            <TrendingUp className="text-white" style={{ width: 16, height: 16 }} />
          </div>
          <div>
            <span className="text-[14px] font-bold text-gray-900 block leading-tight">MarketBridge</span>
            <span className="text-[10px] text-purple-500 font-semibold leading-tight uppercase tracking-wide">Warehouse</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest px-3 mb-2">Main Menu</p>
        {navigation.map((item) => {
          const isActive = item.href === '/warehouse'
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const badgeCount = item.badge ? unreadCount : 0;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon
                className={cn('flex-shrink-0 transition-colors', isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')}
                style={{ width: 16, height: 16 }}
              />
              <span className="flex-1">{item.name}</span>
              {badgeCount > 0 && (
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none',
                  isActive ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
                )}>
                  {badgeCount > 99 ? '99+' : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-3 border-t border-gray-100 space-y-1">
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-gray-50">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' }}>
              {user.name?.charAt(0).toUpperCase() || 'W'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{user.name?.split(' ')[0] || 'Warehouse'}</p>
              <p className="text-[10px] text-gray-400 truncate capitalize">{user.role || 'Admin'}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut style={{ width: 15, height: 15 }} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
