'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp, AlertTriangle, BarChart2, Plus, ChevronRight, Star, Truck, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { warehousesApi, ordersApi, inventoryApi, analyticsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Warehouse, Order, Inventory } from '@/lib/types';

const statusColor: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  processing: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  shipped: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  delivered: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-200',
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
  const totalRevenue = analytics?.revenue?.month || warehouse.total_sales;
  const todayOrders = analytics?.orders?.active || 0;
  const weeklyRevenue: Array<{ date: string; revenue: number }> = analytics?.weekly_revenue || [];

  const statsCards = [
    {
      label: 'Total Products',
      value: warehouse.total_products,
      sub: `+${Math.floor(warehouse.total_products * 0.08)} this month`,
      icon: Package,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      borderColor: 'border-t-blue-500',
    },
    {
      label: 'Total Orders',
      value: warehouse.total_orders,
      sub: `+${todayOrders} today`,
      icon: ShoppingCart,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-t-emerald-500',
    },
    {
      label: 'Total Revenue',
      value: `${warehouse.total_sales.toLocaleString()} Br`,
      sub: '+8.2% this month',
      icon: DollarSign,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      borderColor: 'border-t-violet-500',
    },
    {
      label: 'Performance Score',
      value: `${warehouse.performance_score}%`,
      sub: 'Excellent',
      icon: TrendingUp,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-t-amber-500',
    },
  ];

  const maxRevenue = weeklyRevenue.length > 0 ? Math.max(...weeklyRevenue.map(r => r.revenue), 1) : 1;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back, {warehouse.owner_name}. Here's what's happening today.</p>
        </div>
        <Link href="/warehouse/products/add">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-blue-600/20">
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`bg-white rounded-2xl border border-gray-100 border-t-4 ${stat.borderColor} p-5 hover:shadow-md hover:-translate-y-0.5 transition-all`}>
              <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
              <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-amber-800 mb-3">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="font-semibold text-sm">Inventory Alerts</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {outOfStockItems.length > 0 && (
              <div className="bg-white rounded-xl p-3.5 border border-red-200 shadow-sm">
                <p className="text-sm font-semibold text-red-600">{outOfStockItems.length} products out of stock</p>
                <p className="text-xs text-gray-500 mt-0.5">Restock immediately to avoid lost sales</p>
                <Link href="/warehouse/inventory" className="text-xs text-red-600 font-semibold mt-2 inline-flex items-center gap-1 hover:underline">
                  View Inventory <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}
            {lowStockItems.length > 0 && (
              <div className="bg-white rounded-xl p-3.5 border border-amber-200 shadow-sm">
                <p className="text-sm font-semibold text-amber-600">{lowStockItems.length} products running low</p>
                <p className="text-xs text-gray-500 mt-0.5">Consider restocking soon</p>
                <Link href="/warehouse/inventory" className="text-xs text-amber-600 font-semibold mt-2 inline-flex items-center gap-1 hover:underline">
                  Manage Stock <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/warehouse/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-7 h-7 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">No recent orders</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex -space-x-2 flex-shrink-0">
                    {order.items.slice(0, 2).map((item, i) => (
                      <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white bg-gray-100 flex-shrink-0 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">#{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{order.customer_name}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[order.status] || 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">{order.total.toLocaleString()} Br</p>
                  <Link href={`/warehouse/orders/${order.id}`}>
                    <button className="text-xs text-blue-600 font-medium border border-blue-200 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0">
                      Details
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Revenue Chart Mini */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-sm">Revenue This Week</h3>
              <BarChart2 className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{totalRevenue.toLocaleString()} Br</p>
            <p className="text-xs text-emerald-600 font-medium mb-4">+8.2% vs last week</p>
            <div className="flex items-end gap-1 h-14">
              {weeklyRevenue.length > 0 ? weeklyRevenue.map((r, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-sm bg-blue-500 transition-all"
                    style={{ height: `${Math.max(4, (r.revenue / maxRevenue) * 48)}px` }}
                  />
                  <span className="text-[9px] text-gray-400">{r.date?.split(' ')[1] || i + 1}</span>
                </div>
              )) : Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-sm bg-gray-100" style={{ height: `${8 + Math.random() * 40}px` }} />
                  <span className="text-[9px] text-gray-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Quick Actions</h3>
            <div className="space-y-1">
              {[
                { href: '/warehouse/products/add', label: 'Add New Product', icon: Package, color: 'text-blue-600', bg: 'hover:bg-blue-50' },
                { href: '/warehouse/inventory', label: 'Manage Inventory', icon: AlertTriangle, color: 'text-emerald-600', bg: 'hover:bg-emerald-50' },
                { href: '/warehouse/orders', label: 'View Orders', icon: ShoppingCart, color: 'text-violet-600', bg: 'hover:bg-violet-50' },
                { href: '/warehouse/analytics', label: 'View Analytics', icon: BarChart2, color: 'text-amber-600', bg: 'hover:bg-amber-50' },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.href} href={action.href}>
                    <div className={`flex items-center gap-3 p-2.5 rounded-xl ${action.bg} transition-colors group cursor-pointer`}>
                      <Icon className={`w-4 h-4 ${action.color}`} />
                      <span className="text-sm font-medium text-gray-700">{action.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 ml-auto group-hover:text-gray-600" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Warehouse Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Warehouse Info</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Status', value: <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${warehouse.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'bg-amber-50 text-amber-700'}`}>{warehouse.status}</span> },
                { label: 'Rating', value: <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">{warehouse.rating.toFixed(1)} <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /></span> },
                { label: 'Location', value: <span className="text-sm text-gray-700">{warehouse.city}</span> },
                { label: 'Member Since', value: <span className="text-sm text-gray-700">{new Date(warehouse.member_since).toLocaleDateString()}</span> },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{item.label}</span>
                  {item.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
