'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import {
  Package, ShoppingCart, DollarSign, AlertTriangle,
  BarChart2, Plus, TrendingUp, TrendingDown, ChevronRight,
  Clock, CheckCircle2, Truck,
} from 'lucide-react';
import Link from 'next/link';
import { warehousesApi, ordersApi, inventoryApi, analyticsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Warehouse, Order, Inventory } from '@/lib/types';

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-100',
  processing: 'bg-blue-50 text-blue-700 border border-blue-100',
  confirmed: 'bg-blue-50 text-blue-700 border border-blue-100',
  shipped: 'bg-cyan-50 text-cyan-700 border border-cyan-100',
  delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  cancelled: 'bg-red-50 text-red-700 border border-red-100',
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
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    if (user?.warehouse_id) fetchData();
  }, [user?.warehouse_id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-sm text-gray-400">Warehouse data unavailable.</p>
      </div>
    );
  }

  const lowStockItems = inventory.filter(i => i.status === 'low_stock');
  const outOfStockItems = inventory.filter(i => i.status === 'out_of_stock');
  const recentOrders = orders.slice(0, 5);
  const todayOrders = analytics?.orders?.active || 0;
  const totalRevenue = analytics?.revenue?.month || Number(warehouse.total_sales || 0);
  const weeklyRevenue: Array<{ date: string; revenue: number }> = analytics?.weekly_revenue || [];
  const maxRevenue = Math.max(...weeklyRevenue.map(r => r.revenue), 1);

  const FALLBACK_BARS = [
    { label: 'Mon', h: 60 }, { label: 'Tue', h: 82 }, { label: 'Wed', h: 55 },
    { label: 'Thu', h: 100 }, { label: 'Fri', h: 74 }, { label: 'Sat', h: 90 }, { label: 'Sun', h: 65 },
  ];

  const statusCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };
  const totalOrdersCount = Math.max(orders.length, 1);

  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders,
      sub: '+14% vs yesterday',
      isUp: true,
      icon: ShoppingCart,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Revenue (Today)',
      value: `${Number(totalRevenue).toLocaleString()} Br`,
      sub: '+18.6% vs yesterday',
      isUp: true,
      icon: DollarSign,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Total Products',
      value: Number(warehouse.total_products || 0),
      sub: '+8.2% vs last week',
      isUp: true,
      icon: Package,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Low Stock Items',
      value: lowStockItems.length + outOfStockItems.length,
      sub: `${outOfStockItems.length} out of stock`,
      isUp: false,
      icon: AlertTriangle,
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
  ];

  const DONUT_SEGMENTS = [
    { label: 'Pending', count: statusCounts.pending, color: '#f59e0b', lightColor: '#fef3c7' },
    { label: 'Processing', count: statusCounts.processing, color: '#8b5cf6', lightColor: '#ede9fe' },
    { label: 'Shipped', count: statusCounts.shipped, color: '#3b82f6', lightColor: '#dbeafe' },
    { label: 'Delivered', count: statusCounts.delivered, color: '#10b981', lightColor: '#d1fae5' },
  ];

  let dashOffset = 0;
  const CIRCUMFERENCE = 2 * Math.PI * 38;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Welcome back, {warehouse.owner_name?.split(' ')[0] || 'Admin'} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your store today.</p>
        </div>
        <Link href="/warehouse/products/add">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
            style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
            <Plus style={{ width: 15, height: 15 }} />
            Add New Product
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={stat.iconColor} style={{ width: 18, height: 18 }} />
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {stat.isUp ? <TrendingUp style={{ width: 10, height: 10 }} /> : <TrendingDown style={{ width: 10, height: 10 }} />}
                  {stat.sub.split(' ')[0]}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Weekly sales performance</p>
            </div>
            <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:border-purple-400 bg-white cursor-pointer">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex items-end gap-2 h-44">
            {(weeklyRevenue.length > 0 ? weeklyRevenue.map((r, i) => ({
              label: r.date?.split(' ')[1] || String(i + 1),
              h: Math.max(8, (r.revenue / maxRevenue) * 160),
              active: i === weeklyRevenue.length - 1,
            })) : FALLBACK_BARS.map((b, i) => ({ label: b.label, h: b.h / 100 * 160, active: i === FALLBACK_BARS.length - 1 }))).map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="relative w-full rounded-xl transition-all group-hover:opacity-90 cursor-pointer"
                  style={{
                    height: `${bar.h}px`,
                    background: bar.active
                      ? 'linear-gradient(180deg,#a855f7,#7c3aed)'
                      : 'linear-gradient(180deg,#ede9fe,#ddd6fe)',
                  }} />
                <span className="text-[10px] text-gray-400">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status Donut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Order Status</h2>
          <p className="text-xs text-gray-400 mb-4">Distribution breakdown</p>
          <div className="flex justify-center mb-4">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="38" fill="none" stroke="#f3f4f6" strokeWidth="14" />
              {DONUT_SEGMENTS.map((seg, idx) => {
                const segLen = (seg.count / totalOrdersCount) * CIRCUMFERENCE;
                const el = (
                  <circle key={idx} cx="55" cy="55" r="38" fill="none"
                    stroke={seg.color} strokeWidth="14"
                    strokeDasharray={`${segLen} ${CIRCUMFERENCE - segLen}`}
                    strokeDashoffset={-dashOffset}
                    transform="rotate(-90 55 55)"
                    strokeLinecap="round"
                  />
                );
                dashOffset += segLen;
                return el;
              })}
              <text x="55" y="51" textAnchor="middle" fontSize="16" fontWeight="700" fill="#111827">{orders.length}</text>
              <text x="55" y="63" textAnchor="middle" fontSize="9" fill="#9ca3af">orders</text>
            </svg>
          </div>
          <div className="space-y-2">
            {DONUT_SEGMENTS.map(seg => (
              <div key={seg.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                  <span className="text-xs text-gray-600">{seg.label}</span>
                </div>
                <span className="text-xs font-semibold text-gray-700">{seg.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900">Recent Orders</h3>
            <Link href="/warehouse/orders" className="text-xs text-purple-600 font-semibold flex items-center gap-1 hover:gap-1.5 transition-all">
              View All <ChevronRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          <div>
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-gray-300">
                <ShoppingCart style={{ width: 32, height: 32 }} />
                <p className="text-xs mt-2">No recent orders</p>
              </div>
            ) : recentOrders.map((order, idx) => (
              <div key={order.id} className={`flex items-center gap-3 px-5 py-3 ${idx < recentOrders.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50/50 transition-colors`}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-purple-50 flex-shrink-0">
                  <ShoppingCart className="text-purple-500" style={{ width: 14, height: 14 }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900">#{(order.id || '').slice(-6).toUpperCase()}</p>
                  <p className="text-[11px] text-gray-400 truncate">{order.customer_name}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-gray-900">{(order.total || 0).toLocaleString()} Br</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[order.status] || 'bg-gray-50 text-gray-600 border border-gray-100'}`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900">Inventory Alerts</h3>
            <Link href="/warehouse/inventory" className="text-xs text-purple-600 font-semibold flex items-center gap-1 hover:gap-1.5 transition-all">
              View All <ChevronRight style={{ width: 12, height: 12 }} />
            </Link>
          </div>
          <div className="p-3 space-y-1">
            {outOfStockItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50/50 transition-colors">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{item.product_name}</p>
                  <p className="text-[11px] text-red-500 font-medium">Out of stock</p>
                </div>
              </div>
            ))}
            {lowStockItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50/50 transition-colors">
                <div className="w-2 h-2 bg-amber-400 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{item.product_name}</p>
                  <p className="text-[11px] text-amber-500">{item.available_stock} units left</p>
                </div>
              </div>
            ))}
            {lowStockItems.length === 0 && outOfStockItems.length === 0 && (
              <div className="flex flex-col items-center py-8 text-gray-300">
                <CheckCircle2 style={{ width: 28, height: 28 }} />
                <p className="text-xs mt-2">All stock levels good</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2.5">
            <Link href="/warehouse/products/add">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                <Plus style={{ width: 15, height: 15 }} />
                Add New Product
              </button>
            </Link>
            <Link href="/warehouse/inventory">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors mt-0">
                <AlertTriangle className="text-amber-500" style={{ width: 15, height: 15 }} />
                Manage Inventory
              </button>
            </Link>
            <Link href="/warehouse/orders">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                <ShoppingCart className="text-blue-500" style={{ width: 15, height: 15 }} />
                View Orders
              </button>
            </Link>
            <Link href="/warehouse/analytics">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                <BarChart2 className="text-emerald-500" style={{ width: 15, height: 15 }} />
                Sales Analytics
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
