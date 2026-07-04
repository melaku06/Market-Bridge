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

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)' }}>
            <ShoppingBag className="text-white w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-bold text-gray-900 block leading-none">MarketBridge</span>
            <span className="text-[10px] text-purple-500 font-medium uppercase tracking-wider">Warehouse</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/warehouse' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/25'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              )}
            >
              <item.icon className={cn('w-4.5 h-4.5 flex-shrink-0', isActive ? 'text-white' : 'text-gray-400')} style={{ width: 18, height: 18 }} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
        >
          <LogOut className="flex-shrink-0 text-gray-400" style={{ width: 18, height: 18 }} />
          Logout
        </Link>
      </div>
    </aside>
  );
}
