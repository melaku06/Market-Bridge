'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign, ShoppingCart, Warehouse, Package, TrendingUp, TrendingDown,
  ArrowUp, BarChart2, Bell, ChevronRight, Plus, Activity, CheckCircle,
  Clock, XCircle, Users
} from 'lucide-react';
import { analyticsApi, ordersApi, productsApi, warehousesApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';

const statusColors: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700',
  confirmed:  'bg-blue-50 text-blue-700',
  processing: 'bg-orange-50 text-orange-700',
  shipped:    'bg-violet-50 text-violet-700',
  delivered:  'bg-emerald-50 text-emerald-700',
  cancelled:  'bg-red-50 text-red-700',
};

const recentActivities = [
  { icon: Warehouse, color: 'text-blue-600 bg-blue-50', text: 'New warehouse "TechMart" registered', time: '2 min ago' },
  { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50', text: 'Product "Wireless Headphones" approved', time: '15 min ago' },
  { icon: Package, color: 'text-violet-600 bg-violet-50', text: 'Order #ORD-10245 delivered successfully', time: '1 hr ago' },
  { icon: XCircle, color: 'text-red-600 bg-red-50', text: 'Warehouse "GadgetHub" suspended', time: '2 hr ago' },
  { icon: Bell, color: 'text-amber-600 bg-amber-50', text: 'New product submitted for approval', time: '3 hr ago' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsRes, ordersRes, productsRes, warehousesRes] = await Promise.all([
          analyticsApi.get({}),
          ordersApi.list({ limit: 5 }),
          productsApi.list({ status: 'pending', limit: 5 }),
          warehousesApi.list({}),
        ]);
        setAnalytics(analyticsRes);
        setOrders(Array.isArray(ordersRes) ? ordersRes.slice(0, 5) : (ordersRes as any).data?.slice(0, 5) || []);
        setPendingProducts(Array.isArray(productsRes) ? productsRes.slice(0, 5) : (productsRes as any).data?.slice(0, 5) || []);
        const whList = Array.isArray(warehousesRes) ? warehousesRes : (warehousesRes as any).data || [];
        setWarehouses(whList);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );

  const activeWarehouses = warehouses.filter(w => w.status === 'active').length;
  const totalProducts = analytics?.total_products || 12458;

  const stats = [
    {
      label: 'Total Revenue',
      value: `$${((analytics?.total_revenue || 256780.5) / 1000).toFixed(1)}K`,
      sub: '+16.6% vs Apr',
      isUp: true,
      icon: DollarSign,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Orders',
      value: (analytics?.orders?.total || 2549).toLocaleString(),
      sub: '+12.4% vs Apr',
      isUp: true,
      icon: ShoppingCart,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Active Warehouses',
      value: (activeWarehouses || 128).toLocaleString(),
      sub: '+8.7% vs Apr',
      isUp: true,
      icon: Warehouse,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Active Products',
      value: (totalProducts).toLocaleString(),
      sub: '+10.3% vs Apr',
      isUp: true,
      icon: Package,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Pending Approvals',
      value: (pendingProducts.length || 87).toLocaleString(),
      sub: '-5.3% vs Apr',
      isUp: false,
      icon: Clock,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
    },
  ];

  const orderStatuses = [
    { label: 'Delivered', count: analytics?.orders?.delivered || 1258, pct: 49.3, color: '#10b981' },
    { label: 'Processing', count: analytics?.orders?.processing || 714, pct: 28.0, color: '#f59e0b' },
    { label: 'Shipped', count: analytics?.orders?.shipped || 427, pct: 16.8, color: '#3b82f6' },
    { label: 'Cancelled', count: analytics?.orders?.cancelled || 23, pct: 5.9, color: '#ef4444' },
  ];

  const weeklyRevenue = analytics?.weekly_revenue || [];
  const chartDates = ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'];
  const chartHeights = [60, 95, 75, 130, 110];

  const systemHealth = [
    { label: 'Products', value: analytics?.total_products || 66, href: '/admin/products' },
    { label: 'Warehouses', value: activeWarehouses || 12, href: '/admin/warehouses' },
    { label: 'Margin Updates', value: 8, href: '/admin/margins' },
    { label: 'Promotions', value: analytics?.promotions || 11, href: '/admin/promotions' },
  ];

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'Super Admin'}!</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your platform today.</p>
        </div>
        <span className="text-sm text-gray-400 bg-white border border-gray-100 rounded-lg px-3 py-1.5 font-medium">
          May 1 – May 31, 2024
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 ${s.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={s.iconColor} style={{ width: 16, height: 16 }} />
                </div>
                <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${s.isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {s.isUp ? <ArrowUp style={{ width: 11, height: 11 }} /> : <TrendingDown style={{ width: 11, height: 11 }} />}
                  {s.sub.split(' ')[0]}
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-[11px] font-medium text-gray-500 mt-0.5">{s.label}</p>
              <p className="text-[10px] text-gray-400">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Revenue Overview</h2>
              <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span className="w-3 h-0.5 bg-blue-500 rounded block" />Revenue
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
                  <span className="w-3 h-0.5 bg-violet-400 rounded block" />Orders
                </span>
              </div>
            </div>
            <select className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 text-gray-500 bg-white focus:outline-none">
              <option>This Month</option>
            </select>
          </div>
          <div className="relative h-32">
            {/* Y axis labels */}
            <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[9px] text-gray-400 pr-2">
              <span>150k</span>
              <span>100k</span>
              <span>50k</span>
              <span>0</span>
            </div>
            {/* Chart bars */}
            <div className="ml-7 flex items-end gap-2 h-full border-b border-gray-100">
              {(weeklyRevenue.length > 0 ? weeklyRevenue : chartDates).map((item: any, i: number) => {
                const h = weeklyRevenue.length > 0
                  ? Math.max(8, (item.revenue / Math.max(...weeklyRevenue.map((r: any) => r.revenue), 1)) * 120)
                  : chartHeights[i];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t" style={{ height: h }} />
                    <span className="text-[9px] text-gray-400">{typeof item === 'string' ? item : (item.date?.split(' ')[1] || chartDates[i])}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">Orders by Status</h2>
            <select className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 text-gray-500 bg-white focus:outline-none">
              <option>This Month</option>
            </select>
          </div>
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="49.3 50.7" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="28 72" strokeDashoffset="-49.3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeDasharray="16.8 83.2" strokeDashoffset="-77.3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="5.9 94.1" strokeDashoffset="-94.1" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-base font-bold text-gray-900">{(analytics?.orders?.total || 2549).toLocaleString()}</p>
                <p className="text-[9px] text-gray-400">Total</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {orderStatuses.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-[12px] text-gray-600">{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-gray-900">{s.count.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-400 w-12 text-right">({s.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Recent Activities</h2>
            <Link href="/admin/audit-logs" className="text-[11px] text-blue-600 hover:text-blue-700 font-medium">View All Activities</Link>
          </div>
          <div className="space-y-3">
            {recentActivities.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-7 h-7 ${a.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon style={{ width: 14, height: 14 }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-gray-700 leading-snug">{a.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900">Pending Approvals</h2>
            <span className="text-[11px] bg-amber-50 text-amber-600 font-semibold px-2 py-0.5 rounded-full">
              {pendingProducts.length || 87}
            </span>
          </div>
          <div className="space-y-2.5 mb-4">
            {(pendingProducts.length > 0 ? pendingProducts : [
              { name: 'Products', count: 66 },
              { name: 'Warehouses', count: 12 },
              { name: 'Margin Updates', count: 8 },
              { name: 'Promotions', count: 11 },
            ] as any[]).slice(0, 5).map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[12px] text-gray-700">{item.name || item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-gray-900">{item.count || item.value}</span>
                  <ChevronRight className="text-gray-300" style={{ width: 14, height: 14 }} />
                </div>
              </div>
            ))}
          </div>
          <Link href="/admin/products">
            <button className="w-full py-2 text-[12px] font-semibold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
              Go to Approval Queue
            </button>
          </Link>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-2.5 mb-4">
            {systemHealth.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[12px] text-gray-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-gray-900">{item.value}</span>
                  <ChevronRight className="text-gray-300" style={{ width: 14, height: 14 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            <Link href="/admin/warehouses">
              <button className="w-full py-1.5 text-[12px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <Plus style={{ width: 13, height: 13 }} /> Add New Warehouse
              </button>
            </Link>
            <Link href="/admin/categories">
              <button className="w-full py-1.5 text-[12px] font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <Plus style={{ width: 13, height: 13 }} /> Add New Category
              </button>
            </Link>
            <Link href="/admin/margins">
              <button className="w-full py-1.5 text-[12px] font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <TrendingUp style={{ width: 13, height: 13 }} /> Manage Margins
              </button>
            </Link>
            <Link href="/admin/promotions">
              <button className="w-full py-1.5 text-[12px] font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                <Activity style={{ width: 13, height: 13 }} /> Create Promotion
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
