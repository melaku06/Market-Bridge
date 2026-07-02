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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/warehouse', icon: LayoutDashboard },
  { name: 'Products', href: '/warehouse/products', icon: Package },
  { name: 'Add Product', href: '/warehouse/products/add', icon: PlusCircle },
  { name: 'Inventory', href: '/warehouse/inventory', icon: Warehouse },
  { name: 'Orders', href: '/warehouse/orders', icon: ShoppingCart },
  { name: 'Analytics', href: '/warehouse/analytics', icon: BarChart3 },
  { name: 'Profile', href: '/warehouse/profile', icon: User },
  { name: 'Notifications', href: '/warehouse/notifications', icon: Bell },
  { name: 'Settings', href: '/warehouse/settings', icon: Settings },
];

export default function WarehouseSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Warehouse className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">MarketBridge</span>
        </Link>
        <p className="text-xs text-slate-400 mt-1">Warehouse Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/warehouse' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
