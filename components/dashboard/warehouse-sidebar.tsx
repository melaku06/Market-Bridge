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
  ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/auth-provider';

const navigation = [
  { name: 'Dashboard', href: '/warehouse', icon: LayoutDashboard },
  { name: 'Products', href: '/warehouse/products', icon: Package },
  { name: 'Add Product', href: '/warehouse/products/add', icon: PlusCircle },
  { name: 'Inventory', href: '/warehouse/inventory', icon: Warehouse },
  { name: 'Orders', href: '/warehouse/orders', icon: ShoppingCart },
  { name: 'Analytics', href: '/warehouse/analytics', icon: BarChart3 },
  { name: 'Notifications', href: '/warehouse/notifications', icon: Bell },
  { name: 'Profile', href: '/warehouse/profile', icon: User },
  { name: 'Settings', href: '/warehouse/settings', icon: Settings },
];

export default function WarehouseSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    window.location.href = '/';
  };

  return (
    <aside className="w-56 min-h-screen bg-[#0f1d35] text-white flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            <ShoppingBag className="text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <span className="text-sm font-bold text-white block leading-tight">MarketBridge</span>
            <span className="text-[10px] text-blue-300/70 font-medium leading-tight">Warehouse</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = item.href === '/warehouse'
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150',
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon
                className={cn('flex-shrink-0', isActive ? 'text-white' : 'text-white/50')}
                style={{ width: 15, height: 15 }}
              />
              <span className="flex-1">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-2 border-t border-white/10">
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{user.name?.charAt(0).toUpperCase() || 'W'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name?.split(' ')[0] || 'Warehouse'}</p>
              <p className="text-[10px] text-white/40 truncate">Admin</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-white/60 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut style={{ width: 15, height: 15 }} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
