'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingCart, DollarSign, TrendingUp, ArrowUp, ArrowDown, ChevronRight, BarChart2, Star, Download } from 'lucide-react';
import { warehousesApi, inventoryApi, analyticsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Warehouse, Inventory } from '@/lib/types';

export default function WarehouseAnalytics() {
  const { user } = useAuth();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const warehouseId = user?.warehouse_id;
      if (!warehouseId) return;
      try {
        const [warehouseRes, inventoryRes, analyticsRes] = await Promise.all([
          warehousesApi.get(warehouseId),
          inventoryApi.list({ warehouse_id: warehouseId }),
          analyticsApi.get({ warehouse_id: warehouseId }),
        ]);
        setWarehouse(warehouseRes);
        setInventory(Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes as any).data || []);
        setAnalytics(analyticsRes);
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

  const stats = [
    { name: 'Total Revenue', value: `${warehouse.total_sales.toLocaleString()} Br`, change: '+12.5%', icon: DollarSign, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', borderColor: 'border-t-emerald-500', isUp: true },
    { name: 'Total Orders', value: warehouse.total_orders.toLocaleString(), change: '+8.2%', icon: ShoppingCart, iconBg: 'bg-blue-50', iconColor: 'text-blue-600', borderColor: 'border-t-blue-500', isUp: true },
    { name: 'Total Products', value: warehouse.total_products.toLocaleString(), change: '+3', icon: Package, iconBg: 'bg-violet-50', iconColor: 'text-violet-600', borderColor: 'border-t-violet-500', isUp: true },
    { name: 'Rating', value: warehouse.rating.toFixed(1), change: '+0.2', icon: Star, iconBg: 'bg-amber-50', iconColor: 'text-amber-600', borderColor: 'border-t-amber-500', isUp: true },
  ];

  const lowStockItems = inventory.filter(i => i.status === 'low_stock');
  const outOfStockItems = inventory.filter(i => i.status === 'out_of_stock');
  const inStockCount = inventory.filter(i => i.status === 'in_stock').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/warehouse" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track your warehouse performance and metrics.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors bg-white">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Report</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className={`bg-white rounded-2xl border border-gray-100 border-t-4 ${stat.borderColor} p-5 hover:shadow-md hover:-translate-y-0.5 transition-all`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                  {stat.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
              <p className="text-xs font-semibold text-gray-500">{stat.name}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-xs text-gray-500 mt-0.5">Weekly revenue performance</p>
            </div>
            <BarChart2 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-56 flex items-end justify-between gap-2">
            {weeklyRevenue.length > 0 ? weeklyRevenue.map((item, idx) => {
              const height = (item.revenue / maxRevenue) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full relative">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500"
                      style={{ height: `${height * 1.8}px` }}
                    />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none">
                      {item.revenue.toLocaleString()} Br
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{item.date?.split(' ')[1] || idx + 1}</span>
                </div>
              );
            }) : Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 rounded-t-lg" style={{ height: `${20 + Math.random() * 140}px` }} />
                <span className="text-xs text-gray-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-1">Top Products</h2>
          <p className="text-xs text-gray-500 mb-4">By revenue this month</p>
          <div className="space-y-3">
            {topProducts.length > 0 ? topProducts.slice(0, 5).map((product, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  idx === 0 ? 'bg-amber-100 text-amber-700' :
                  idx === 1 ? 'bg-gray-100 text-gray-700' :
                  idx === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-gray-50 text-gray-500'
                }`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.units} units</p>
                </div>
                <p className="text-sm font-bold text-gray-900 flex-shrink-0">{product.revenue.toLocaleString()} Br</p>
              </div>
            )) : (
              <p className="text-sm text-gray-400 text-center py-8">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Inventory Status + Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Inventory Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Inventory Status</h2>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-emerald-700">{inStockCount}</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">In Stock</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-amber-700">{lowStockItems.length}</p>
              <p className="text-xs text-amber-600 font-medium mt-1">Low Stock</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-red-700">{outOfStockItems.length}</p>
              <p className="text-xs text-red-600 font-medium mt-1">Out of Stock</p>
            </div>
          </div>
          {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Products Needing Attention</h3>
              <div className="space-y-2">
                {outOfStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                    <span className="text-sm font-medium text-red-700">{item.product_name}</span>
                    <span className="text-xs text-red-600 font-semibold">Out of Stock</span>
                  </div>
                ))}
                {lowStockItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl">
                    <span className="text-sm font-medium text-amber-700">{item.product_name}</span>
                    <span className="text-xs text-amber-600 font-semibold">{item.available_stock} left</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Performance Score */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Performance Score</h2>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                <circle cx="64" cy="64" r="56" stroke="#2563eb" strokeWidth="12" fill="none" strokeLinecap="round" strokeDasharray={`${warehouse.performance_score * 3.52} 350`} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">{warehouse.performance_score}%</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mb-4">
              {warehouse.performance_score >= 90 ? 'Excellent performance!' : warehouse.performance_score >= 80 ? 'Good performance' : 'Needs improvement'}
            </p>
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Order Fulfillment</span>
                <span className="font-semibold text-gray-900">98%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Customer Rating</span>
                <span className="font-semibold text-gray-900 flex items-center gap-1">
                  {warehouse.rating.toFixed(1)} <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">On-time Delivery</span>
                <span className="font-semibold text-gray-900">95%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
