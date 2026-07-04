'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, AlertTriangle, BarChart2, Plus, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { warehousesApi, ordersApi, inventoryApi, analyticsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Warehouse, Order, Inventory } from '@/lib/types';

const statusColor: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700',
  processing: 'bg-blue-50 text-blue-700',
  shipped: 'bg-cyan-50 text-cyan-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
  confirmed: 'bg-blue-50 text-blue-700',
};

export default function WarehouseDashboard() {
  const { user } = useAuth();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const warehouseId = user?.warehouse_id;
      if (!warehouseId) return;
      try {
        const [warehouseRes, ordersRes, inventoryRes, analyticsRes] = await Promise.all([
          warehousesApi.get(warehouseId),
          ordersApi.list({ warehouse_id: warehouseId, limit: 10 }),
          inventoryApi.list({ warehouse_id: warehouseId }),
          analyticsApi.get({ warehouse_id: warehouseId }),
        ]);
        setWarehouse(warehouseRes);
        setOrders(Array.isArray(ordersRes) ? ordersRes : (ordersRes as any).data || []);
        setInventory(Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes as any).data || []);
        setAnalytics(analyticsRes);
      } catch (error) {
        console.error('Failed to fetch warehouse data:', error);
      } finally {
        setLoading(false);
      }
    }
    if (user?.warehouse_id) fetchData();
  }, [user?.warehouse_id]);

  if (loading || !warehouse) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);
  const lowStockItems = inventory.filter(i => i.status === 'low_stock');
  const outOfStockItems = inventory.filter(i => i.status === 'out_of_stock');
  const todayOrders = analytics?.orders?.active || orders.filter(o => {
    const today = new Date().toDateString();
    return new Date(o.created_at).toDateString() === today;
  }).length;
  const totalRevenue = analytics?.revenue?.month || Number(warehouse.total_sales);
  const weeklyRevenue: Array<{ date: string; revenue: number }> = analytics?.weekly_revenue || [];
  const maxRevenue = weeklyRevenue.length > 0 ? Math.max(...weeklyRevenue.map(r => r.revenue), 1) : 1;

  const statusCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };
  const totalOrdersCount = orders.length || 1;

  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders,
      sub: '+14% vs yesterday',
      isUp: true,
      icon: ShoppingCart,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-500',
    },
    {
      label: 'Revenue (Today)',
      value: `${Number(totalRevenue).toLocaleString()} Br`,
      sub: '+18.6% vs yesterday',
      isUp: true,
      icon: DollarSign,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Total Products',
      value: Number(warehouse.total_products),
      sub: '+8.2% vs last week',
      isUp: true,
      icon: Package,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Low Stock Items',
      value: lowStockItems.length + outOfStockItems.length,
      sub: `${outOfStockItems.length} new alerts`,
      isUp: false,
      icon: AlertTriangle,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Welcome back, {warehouse.owner_name || 'Warehouse Admin'}!{' '}
            <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your store today.</p>
        </div>
        <Link href="/warehouse/products/add">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors">
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4.5 h-4.5 ${stat.iconColor}`} style={{ width: 18, height: 18 }} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.isUp ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {stat.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.sub.split(' ')[0]}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sales Overview Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-sm">Sales Overview</h2>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-40 flex items-end gap-1">
            {weeklyRevenue.length > 0 ? weeklyRevenue.map((r, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer"
                  style={{ height: `${Math.max(4, (r.revenue / maxRevenue) * 120)}px` }}
                />
                <span className="text-[9px] text-gray-400">{r.date?.split(' ')[1] || ['May 20','May 21','May 22','May 23','May 24','May 25','May 26'][i] || i}</span>
              </div>
            )) : Array.from({ length: 7 }, (_, i) => ({
              h: [60, 80, 55, 100, 75, 90, 65][i],
              label: ['May 20','May 21','May 22','May 23','May 24','May 25','May 26'][i],
            })).map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t bg-blue-500" style={{ height: `${d.h}px` }} />
                <span className="text-[9px] text-gray-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status Donut */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4">Orders by Status</h2>
          <div className="flex items-center justify-center mb-4">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="16" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="16"
                strokeDasharray={`${(statusCounts.pending / totalOrdersCount) * 251} 251`}
                strokeDashoffset="0" transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="16"
                strokeDasharray={`${(statusCounts.processing / totalOrdersCount) * 251} 251`}
                strokeDashoffset={`-${(statusCounts.pending / totalOrdersCount) * 251}`}
                transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="16"
                strokeDasharray={`${(statusCounts.shipped / totalOrdersCount) * 251} 251`}
                strokeDashoffset={`-${((statusCounts.pending + statusCounts.processing) / totalOrdersCount) * 251}`}
                transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="16"
                strokeDasharray={`${(statusCounts.delivered / totalOrdersCount) * 251} 251`}
                strokeDashoffset={`-${((statusCounts.pending + statusCounts.processing + statusCounts.shipped) / totalOrdersCount) * 251}`}
                transform="rotate(-90 50 50)" />
              <text x="50" y="54" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#111827">{orders.length}</text>
            </svg>
          </div>
          <div className="space-y-1.5">
            {[
              { label: 'Pending', count: statusCounts.pending, color: 'bg-amber-400' },
              { label: 'Processing', count: statusCounts.processing, color: 'bg-blue-500' },
              { label: 'Shipped', count: statusCounts.shipped, color: 'bg-purple-500' },
              { label: 'Delivered', count: statusCounts.delivered, color: 'bg-emerald-500' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
                <span className="text-xs font-semibold text-gray-700">
                  {orders.length > 0 ? `${Math.round((item.count / orders.length) * 100)}%` : '0%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders | Inventory Alerts | Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Recent Orders</h3>
            <Link href="/warehouse/orders" className="text-xs text-blue-600 font-medium hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-8">No recent orders</p>
            ) : recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900">#{order.id.slice(-6).toUpperCase()}</p>
                  <p className="text-[11px] text-gray-400 truncate">{order.customer_name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-gray-900">{order.total.toLocaleString()} Br</p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColor[order.status] || 'bg-gray-50 text-gray-600'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Inventory Alerts</h3>
            <Link href="/warehouse/inventory" className="text-xs text-blue-600 font-medium hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50 p-2">
            {outOfStockItems.slice(0, 2).map((item) => (
              <div key={item.id} className="flex items-center gap-2 px-2 py-2.5">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{item.product_name}</p>
                  <p className="text-[11px] text-red-500">Out of stock</p>
                </div>
              </div>
            ))}
            {lowStockItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-2 px-2 py-2.5">
                <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{item.product_name}</p>
                  <p className="text-[11px] text-amber-500">Stock: {item.available_stock} units</p>
                </div>
              </div>
            ))}
            {lowStockItems.length === 0 && outOfStockItems.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-8">All stock levels are good</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-bold text-gray-900 text-sm mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/warehouse/products/add">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors">
                <Plus className="w-4 h-4" />
                Add New Product
              </button>
            </Link>
            <Link href="/warehouse/inventory">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Manage Inventory
              </button>
            </Link>
            <Link href="/warehouse/orders">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                <ShoppingCart className="w-4 h-4 text-blue-500" />
                View Orders
              </button>
            </Link>
            <Link href="/warehouse/analytics">
              <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors">
                <BarChart2 className="w-4 h-4 text-emerald-500" />
                Sales Analytics
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
