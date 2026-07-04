'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, DollarSign, Users, ArrowUp, ArrowDown, ChevronRight, BarChart2 } from 'lucide-react';
import { warehousesApi, inventoryApi, analyticsApi, ordersApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Warehouse, Inventory, Order } from '@/lib/types';

export default function WarehouseAnalytics() {
  const { user } = useAuth();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const warehouseId = user?.warehouse_id;
      if (!warehouseId) return;
      try {
        const [warehouseRes, inventoryRes, analyticsRes, ordersRes] = await Promise.all([
          warehousesApi.get(warehouseId),
          inventoryApi.list({ warehouse_id: warehouseId }),
          analyticsApi.get({ warehouse_id: warehouseId }),
          ordersApi.list({ warehouse_id: warehouseId }),
        ]);
        setWarehouse(warehouseRes);
        setInventory(Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes as any).data || []);
        setAnalytics(analyticsRes);
        setOrders(Array.isArray(ordersRes) ? ordersRes : (ordersRes as any).data || []);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
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

  const weeklyRevenue: Array<{ date: string; revenue: number }> = analytics?.weekly_revenue || [];
  const topProducts: Array<{ name: string; revenue: number; units: number }> = analytics?.top_products || [];
  const maxRevenue = weeklyRevenue.length > 0 ? Math.max(...weeklyRevenue.map(r => r.revenue), 1) : 1;
  const avgOrderValue = orders.length > 0 ? (orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0;

  const statusCounts = {
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };
  const totalOrders = orders.length || 1;

  const categoryRevenue = [
    { name: 'Electronics', value: 49, color: 'bg-blue-500' },
    { name: 'Fashion', value: 28, color: 'bg-emerald-500' },
    { name: 'Footwear', value: 14, color: 'bg-amber-500' },
    { name: 'Home & Kitchen', value: 9, color: 'bg-red-400' },
  ];

  const stats = [
    { name: 'Total Orders', value: Number(warehouse.total_orders).toLocaleString(), change: '+18.5% vs Apr', icon: ShoppingCart, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', isUp: true },
    { name: 'Total Revenue', value: `${Number(warehouse.total_sales).toLocaleString()} Br`, change: '+22.7% vs Apr', icon: DollarSign, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', isUp: true },
    { name: 'Average Order Value', value: `${avgOrderValue.toFixed(0)} Br`, change: '+4.2% vs Apr', icon: BarChart2, iconBg: 'bg-amber-50', iconColor: 'text-amber-500', isUp: true },
    { name: 'Total Customers', value: Math.max(1, Math.floor(Number(warehouse.total_orders) * 0.7)).toString(), change: '+15.3% vs Apr', icon: Users, iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600', isUp: true },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/warehouse" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Analytics</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track performance and key metrics.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none">
            <option>May 1 - May 31, 2024</option>
            <option>Apr 1 - Apr 30, 2024</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {stat.change.split(' ')[0]}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.name}</p>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">{stat.change}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-900 text-sm">Revenue Overview</h2>
              <p className="text-xs text-gray-500 mt-0.5">Daily revenue performance</p>
            </div>
            <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 text-gray-600 focus:outline-none">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-48 flex items-end gap-2">
            {weeklyRevenue.length > 0 ? weeklyRevenue.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-sm transition-colors cursor-pointer"
                  style={{ height: `${Math.max(8, (item.revenue / maxRevenue) * 160)}px` }}
                />
                <span className="text-[9px] text-gray-400">{item.date?.split(' ')[1] || idx + 1}</span>
              </div>
            )) : Array.from({ length: 7 }, (_, i) => ({
              h: [60, 80, 55, 100, 75, 90, 65][i],
              label: ['May 1','May 5','May 10','May 15','May 20','May 25','May 29'][i],
            })).map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-blue-500 rounded-t-sm" style={{ height: `${d.h}px` }} />
                <span className="text-[9px] text-gray-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4">Orders by Status</h2>
          <div className="flex items-center justify-center mb-4">
            <svg width="110" height="110" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="14" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="14"
                strokeDasharray={`${(statusCounts.pending / totalOrders) * 251} 251`}
                transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="14"
                strokeDasharray={`${(statusCounts.processing / totalOrders) * 251} 251`}
                strokeDashoffset={`-${(statusCounts.pending / totalOrders) * 251}`}
                transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#8b5cf6" strokeWidth="14"
                strokeDasharray={`${(statusCounts.shipped / totalOrders) * 251} 251`}
                strokeDashoffset={`-${((statusCounts.pending + statusCounts.processing) / totalOrders) * 251}`}
                transform="rotate(-90 50 50)" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#10b981" strokeWidth="14"
                strokeDasharray={`${(statusCounts.delivered / totalOrders) * 251} 251`}
                strokeDashoffset={`-${((statusCounts.pending + statusCounts.processing + statusCounts.shipped) / totalOrders) * 251}`}
                transform="rotate(-90 50 50)" />
              <text x="50" y="54" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#111827">{orders.length}</text>
            </svg>
          </div>
          <div className="space-y-2">
            {[
              { label: 'New', count: statusCounts.pending, pct: Math.round((statusCounts.pending / totalOrders) * 100), color: 'bg-blue-500' },
              { label: 'Processing', count: statusCounts.processing, pct: Math.round((statusCounts.processing / totalOrders) * 100), color: 'bg-amber-400' },
              { label: 'Shipped', count: statusCounts.shipped, pct: Math.round((statusCounts.shipped / totalOrders) * 100), color: 'bg-purple-500' },
              { label: 'Delivered', count: statusCounts.delivered, pct: Math.round((statusCounts.delivered / totalOrders) * 100), color: 'bg-emerald-500' },
              { label: 'Cancelled', count: statusCounts.cancelled, pct: Math.round((statusCounts.cancelled / totalOrders) * 100), color: 'bg-red-400' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                  <span className="text-xs text-gray-600">{item.label} ({item.count})</span>
                </div>
                <span className="text-xs font-semibold text-gray-700">{item.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Selling + Sales by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.length > 0 ? topProducts.slice(0, 5).map((product, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-4">{idx + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: `${Math.max(20, 100 - idx * 15)}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 flex-shrink-0">{product.units} sold</p>
              </div>
            )) : [
              { name: 'Wireless Headphones', units: 245 },
              { name: 'Smart Watch Series 5', units: 189 },
              { name: 'Premium Backpack', units: 166 },
              { name: 'Running Shoes', units: 132 },
              { name: 'Bluetooth Speaker', units: 118 },
            ].map((product, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-4">{idx + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${100 - idx * 15}%` }} />
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 flex-shrink-0">{product.units} sold</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 text-sm mb-4">Sales by Category</h2>
          <div className="space-y-4">
            {categoryRevenue.map(cat => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                  <span className="text-sm font-bold text-gray-900">{cat.value}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${cat.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
