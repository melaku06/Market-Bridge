'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Percent,
  FolderTree,
  Image,
  Users,
  ShoppingCart,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  BarChart2,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SidebarIcon } from '@/components/ui/market-bridge-logo';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Product Approval', href: '/admin/products', icon: Package },
  { name: 'Warehouses', href: '/admin/warehouses', icon: Warehouse },
  { name: 'Margin Management', href: '/admin/margins', icon: Percent },
  { name: 'Categories', href: '/admin/categories', icon: FolderTree },
  { name: 'Promotions', href: '/admin/promotions', icon: Image },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart2 },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
  { name: 'System Settings', href: '/admin/system-settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#0F172A] text-white flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-slate-800/50">
        <Link href="/" className="flex items-center gap-3">
          <SidebarIcon />
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400 bg-clip-text text-transparent block">
              MarketBridge
            </span>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
              )}
            >
              <item.icon className={cn(
                'w-5 h-5 transition-transform duration-200',
                isActive ? 'text-white' : 'text-slate-500 group-hover:text-violet-300'
              )} />
              <span className="flex-1">{item.name}</span>
              {isActive && <ChevronRight className="w-4 h-4 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800/50">
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
