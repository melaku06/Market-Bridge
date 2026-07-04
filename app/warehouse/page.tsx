'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import {
  ShoppingCart, DollarSign, Package, AlertTriangle, ChevronRight, Plus,
  TrendingUp, TrendingDown, Eye, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import { warehousesApi, ordersApi, inventoryApi, analyticsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Warehouse, Order, Inventory } from '@/lib/types';

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let cumulative = 0;
  const cx = 60; const cy = 60; const r = 48; const circumference = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-6">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {data.map((d, i) => {
          const pct = d.value / total;
          const dash = pct * circumference;
          const offset = circumference - cumulative * circumference;
          cumulative += pct;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={d.color}
              strokeWidth="16"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={offset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '60px 60px' }}
            />
          );
        })}
        <circle cx={cx} cy={cy} r="32" fill="white" />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="#111827">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="#9ca3af">Total</text>
      </svg>
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-gray-600">{d.label}</span>
            <span className="text-xs font-bold text-gray-900 ml-auto pl-3">{d.value}</span>
            <span className="text-xs text-gray-400">({total > 0 ? Math.round(d.value / total * 100) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);
  const lowStockItems = inventory.filter(i => i.status === 'low_stock');
  const outOfStockItems = inventory.filter(i => i.status === 'out_of_stock');
  const todayOrders = analytics?.orders?.active || 0;
  const totalRevenue = Number(warehouse.total_sales);
  const weeklyRevenue: Array<{ date: string; revenue: number }> = analytics?.weekly_revenue || [];
  const maxRevenue = weeklyRevenue.length > 0 ? Math.max(...weeklyRevenue.map(r => r.revenue), 1) : 1;

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;
  const shippedCount = orders.filter(o => o.status === 'shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  const donutData = [
    { label: 'Pending', value: pendingCount, color: '#f59e0b' },
    { label: 'Processing', value: processingCount, color: '#3b82f6' },
    { label: 'Shipped', value: shippedCount, color: '#8b5cf6' },
    { label: 'Delivered', value: deliveredCount, color: '#10b981' },
  ];

  const statsCards = [
    {
      label: "Today's Orders",
      value: todayOrders,
      sub: '+14% vs yesterday',
      up: true,
      icon: ShoppingCart,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      label: 'Revenue (Today)',
      value: `${(totalRevenue * 0.003).toFixed(2)} Br`,
      sub: '+18.8% vs yesterday',
      up: true,
      icon: DollarSign,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Total Products',
      value: Number(warehouse.total_products),
      sub: '+6.2% vs last week',
      up: true,
      icon: Package,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
    {
      label: 'Low Stock Items',
      value: lowStockItems.length + outOfStockItems.length,
      sub: `${outOfStockItems.length} new alerts`,
      up: false,
      icon: AlertTriangle,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
    },
  ];

  const quickActions = [
    { label: 'Add New Product', href: '/warehouse/products/add', color: 'bg-purple-600 hover:bg-purple-700 text-white' },
    { label: 'Manage Inventory', href: '/warehouse/inventory', color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200' },
    { label: 'View Orders', href: '/warehouse/orders', color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200' },
    { label: 'Sales Analytics', href: '/warehouse/analytics', color: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Welcome back, Warehouse Admin! 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.sub.split(' ')[0]}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              <p className={`text-xs font-medium mt-0.5 ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sales Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">Sales Overview</h2>
            </div>
            <select className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-300">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-purple-600 rounded" />
              <span className="text-xs text-gray-500">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-blue-400 rounded" />
              <span className="text-xs text-gray-500">Orders</span>
            </div>
          </div>
          <div className="h-36 flex items-end gap-1 relative">
            {/* Y-axis lines */}
            {[0, 25, 50, 75, 100].map(pct => (
              <div key={pct} className="absolute left-0 right-0 border-t border-gray-50" style={{ bottom: `${pct}%` }} />
            ))}
            {(weeklyRevenue.length > 0 ? weeklyRevenue : Array.from({ length: 7 }).map((_, i) => ({ date: `Day ${i + 1}`, revenue: 5000 + Math.random() * 5000 }))).map((r, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 relative group">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-purple-400 transition-all hover:from-purple-700 hover:to-purple-500"
                  style={{ height: `${Math.max(4, (r.revenue / maxRevenue) * 130)}px` }}
                />
                <span className="text-[9px] text-gray-400 absolute -bottom-5">{r.date?.split(' ')[1] || ['May 20', 'May 21', 'May 22', 'May 23', 'May 24', 'May 25', 'May 26'][i]?.split(' ')[1] || i + 1}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-7 text-[9px] text-gray-400">
            {['May 20', 'May 21', 'May 22', 'May 23', 'May 24', 'May 25', 'May 26'].map(d => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Orders by Status</h2>
          <DonutChart data={donutData} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/warehouse/orders" className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-0.5">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/60">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Order ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">No recent orders</td>
                  </tr>
                ) : recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-semibold text-gray-900">#{order.id.slice(-6).toUpperCase()}</span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-700">{order.customer_name}</td>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{order.total.toLocaleString()} Br</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Inventory Alerts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Inventory Alerts</h3>
            {lowStockItems.length === 0 && outOfStockItems.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No alerts — all stock levels are healthy</p>
            ) : (
              <div className="space-y-2">
                {outOfStockItems.slice(0, 2).map(item => (
                  <div key={item.id} className="flex items-start gap-2.5 p-3 bg-red-50 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{item.product_name}</p>
                      <p className="text-[10px] text-red-600 font-medium">Out of Stock</p>
                    </div>
                  </div>
                ))}
                {lowStockItems.slice(0, 2).map(item => (
                  <div key={item.id} className="flex items-start gap-2.5 p-3 bg-amber-50 rounded-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{item.product_name}</p>
                      <p className="text-[10px] text-amber-600 font-medium">Stock: {item.available_stock} units</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {quickActions.map(action => (
                <Link key={action.href} href={action.href}>
                  <button className={`w-full py-2.5 px-3 rounded-xl text-sm font-medium transition-colors text-center ${action.color}`}>
                    {action.label}
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
