'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Percent,
  FolderTree,
  Megaphone,
  Users,
  ShoppingCart,
  Bell,
  Settings,
  BarChart2,
  FileText,
  Send,
  ShoppingBag,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Product Approval', href: '/admin/products', icon: Package },
  { name: 'Warehouses', href: '/admin/warehouses', icon: Warehouse },
  { name: 'Margin Management', href: '/admin/margins', icon: Percent },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Promotions', href: '/admin/promotions', icon: Megaphone },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { name: 'Telegram', href: '/admin/notifications', icon: Send },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
  { name: 'System Settings', href: '/admin/system-settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)' }}>
            <ShoppingBag className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">MarketBridge</p>
            <p className="text-[10px] text-gray-400 leading-tight">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');

          // Deduplicate Telegram/Notifications highlight: only one can be active
          const showActive = isActive;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150',
                showActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('flex-shrink-0', showActive ? 'text-white' : 'text-gray-400')} style={{ width: 16, height: 16 }} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom link */}
      <div className="px-3 py-3 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
        >
          <ShoppingBag className="text-gray-400 flex-shrink-0" style={{ width: 16, height: 16 }} />
          <span>Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
