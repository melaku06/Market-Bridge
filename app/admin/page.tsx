'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import Link from 'next/link';
import {
  DollarSign, ShoppingCart, Warehouse, Package, TrendingUp, TrendingDown,
  ArrowUp, BarChart2, Bell, ChevronRight, Plus, Activity, CheckCircle,
  Clock, XCircle, Users
} from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useAnalyticsStore } from '@/stores/analytics/analytics-store';
import { useOrdersStore } from '@/stores/orders/orders-store';
import { useProductsStore } from '@/stores/products/products-store';
import { useWarehouseStore } from '@/stores/warehouse/warehouse-store';
import { useAdminStore } from '@/stores/admin/admin-store';

const statusColors: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700',
  confirmed:  'bg-blue-50 text-blue-700',
  processing: 'bg-orange-50 text-orange-700',
  shipped:    'bg-violet-50 text-violet-700',
  delivered:  'bg-emerald-50 text-emerald-700',
  cancelled:  'bg-red-50 text-red-700',
};

const actionIcons: Record<string, { icon: typeof Warehouse; color: string }> = {
  create: { icon: Plus, color: 'text-blue-600 bg-blue-50' },
  update: { icon: Activity, color: 'text-amber-600 bg-amber-50' },
  approve: { icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50' },
  reject: { icon: XCircle, color: 'text-red-600 bg-red-50' },
  delete: { icon: XCircle, color: 'text-red-600 bg-red-50' },
  login: { icon: Users, color: 'text-violet-600 bg-violet-50' },
};

function formatTimeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  return `${days} days ago`;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data, isLoading: analyticsLoading, fetchAnalytics } = useAnalyticsStore();
  const analytics = data as any;
  const { orders, isLoading: ordersLoading, fetchOrders } = useOrdersStore();
  const { products: pendingProducts, isLoading: productsLoading, fetchProducts } = useProductsStore();
  const { warehouses, isLoading: warehousesLoading, fetchWarehouses } = useWarehouseStore();
  const { auditLogs, isLoading: logsLoading, fetchAuditLogs, fetchPendingProducts, pendingProducts: adminPendingProducts } = useAdminStore();
  const loading = analyticsLoading || ordersLoading || productsLoading || warehousesLoading || logsLoading;

  useEffect(() => {
    fetchAnalytics({});
    fetchOrders({ limit: 5 });
    fetchProducts({ status: 'pending', limit: 5 });
    fetchWarehouses({});
    fetchAuditLogs({ limit: 5 });
    fetchPendingProducts();
  }, [fetchAnalytics, fetchOrders, fetchProducts, fetchWarehouses, fetchAuditLogs, fetchPendingProducts]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  );

  const ordersList = Array.isArray(orders) ? orders.slice(0, 5) : (orders as any).data?.slice(0, 5) || [];
  const pendingList = Array.isArray(pendingProducts) ? pendingProducts.slice(0, 5) : (pendingProducts as any).data?.slice(0, 5) || [];
  const activeWarehouses = warehouses.filter(w => w.status === 'active').length;
  const totalProducts = analytics?.total_products || 0;
  const totalRevenue = Number(analytics?.total_revenue || 0);
  const totalOrdersCount = analytics?.totalOrders || orders.length;
  const pendingApprovalsCount = adminPendingProducts.length || pendingList.length;

  const stats = [
    {
      label: 'Total Revenue',
      value: totalRevenue > 0 ? `${(totalRevenue / 1000).toFixed(1)}K Br` : '0 Br',
      sub: 'This month',
      isUp: true,
      icon: DollarSign,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Orders',
      value: totalOrdersCount.toLocaleString(),
      sub: 'All time',
      isUp: true,
      icon: ShoppingCart,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Active Warehouses',
      value: activeWarehouses.toLocaleString(),
      sub: 'Currently active',
      isUp: true,
      icon: Warehouse,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Active Products',
      value: totalProducts.toLocaleString(),
      sub: 'Published',
      isUp: true,
      icon: Package,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Pending Approvals',
      value: pendingApprovalsCount.toLocaleString(),
      sub: 'Awaiting review',
      isUp: false,
      icon: Clock,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
    },
  ];

  const orderStatuses = (analytics?.order_status_overview || []).map((s: any) => ({
    label: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    count: s.count,
    pct: s.percentage,
    color: s.status === 'delivered' ? '#10b981' : s.status === 'processing' ? '#f59e0b' : s.status === 'shipped' ? '#3b82f6' : '#ef4444',
  }));

  const weeklyRevenue = analytics?.weekly_revenue || [];

  const systemHealth = [
    { label: 'Products', value: totalProducts, href: '/admin/products' },
    { label: 'Warehouses', value: activeWarehouses, href: '/admin/warehouses' },
    { label: 'Margin Updates', value: analytics?.margin_rules || 0, href: '/admin/margins' },
    { label: 'Promotions', value: analytics?.promotions || 0, href: '/admin/promotions' },
  ];

  const currentDate = new Date();
  const dateRange = `${currentDate.toLocaleDateString('en-US', { month: 'short' })} 1 – ${currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'Super Admin'}!</h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your platform today.</p>
        </div>
        <span className="text-sm text-gray-400 bg-white border border-gray-100 rounded-lg px-3 py-1.5 font-medium">
          {dateRange}
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
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="relative h-32">
            {weeklyRevenue.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-[12px] text-gray-400">No revenue data available</p>
              </div>
            ) : (
              <>
                {/* Y axis labels */}
                <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[9px] text-gray-400 pr-2">
                  <span>{Math.max(...weeklyRevenue.map((r: any) => r.revenue)).toLocaleString()}</span>
                  <span>{Math.round(Math.max(...weeklyRevenue.map((r: any) => r.revenue)) / 2).toLocaleString()}</span>
                  <span>0</span>
                </div>
                {/* Chart bars */}
                <div className="ml-7 flex items-end gap-2 h-full border-b border-gray-100">
                  {weeklyRevenue.map((item: any, i: number) => {
                    const maxRev = Math.max(...weeklyRevenue.map((r: any) => r.revenue), 1);
                    const h = Math.max(8, (item.revenue / maxRev) * 120);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t" style={{ height: h }} />
                        <span className="text-[9px] text-gray-400">{item.date}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">Orders by Status</h2>
            <select className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 text-gray-500 bg-white focus:outline-none">
              <option>All Time</option>
            </select>
          </div>
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
                {orderStatuses.length > 0 && orderStatuses.map((s: any, i: number) => {
                  const offset = orderStatuses.slice(0, i).reduce((sum: number, curr: any) => sum + curr.pct, 0);
                  return (
                    <circle
                      key={i}
                      cx="18"
                      cy="18"
                      r="15.9"
                      fill="none"
                      stroke={s.color}
                      strokeWidth="3.5"
                      strokeDasharray={`${s.pct} ${100 - s.pct}`}
                      strokeDashoffset={-offset}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-base font-bold text-gray-900">{totalOrdersCount.toLocaleString()}</p>
                <p className="text-[9px] text-gray-400">Total</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {orderStatuses.map((s: { label: string; count: number; pct: number; color: string }, i: number) => (
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
            {auditLogs.length === 0 ? (
              <p className="text-[12px] text-gray-400 text-center py-4">No recent activities</p>
            ) : auditLogs.slice(0, 5).map((log) => {
              const { icon, color } = actionIcons[log.action] || { icon: Activity, color: 'text-gray-600 bg-gray-50' };
              const Icon = icon;
              return (
                <div key={log.id} className="flex items-start gap-3">
                  <div className={`w-7 h-7 ${color} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <Icon style={{ width: 14, height: 14 }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-gray-700 leading-snug">{log.description || `${log.action} on ${log.entity_type}`}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{formatTimeAgo(log.created_at)}</p>
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
              {pendingApprovalsCount}
            </span>
          </div>
          <div className="space-y-2.5 mb-4">
            {pendingApprovalsCount === 0 ? (
              <p className="text-[12px] text-gray-400 text-center py-4">No pending approvals</p>
            ) : (adminPendingProducts.length > 0 ? adminPendingProducts : pendingList).slice(0, 5).map((item: any) => (
              <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-[12px] text-gray-700 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400">{item.warehouse_name || 'Pending'}</span>
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
