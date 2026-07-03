'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { warehousesApi, inventoryApi, analyticsApi } from '@/lib/api';
import type { Warehouse, Inventory } from '@/lib/types';

export default function WarehouseAnalytics() {
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [analytics, setAnalytics] = useState<{
    weekly_revenue: Array<{ date: string; revenue: number }>;
    top_products: Array<{ name: string; revenue: number; units: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const warehouseId = 'wh-001';
        const [warehouseRes, inventoryRes, analyticsRes] = await Promise.all([
          warehousesApi.get(warehouseId),
          inventoryApi.list({ warehouse_id: warehouseId }),
          analyticsApi.get({ warehouse_id: warehouseId }),
        ]);
        setWarehouse(warehouseRes);
        const inventoryData = Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes as { data?: Inventory[] }).data || [];
        setInventory(inventoryData);
        setAnalytics({
          weekly_revenue: (analyticsRes as any).weekly_revenue || [],
          top_products: (analyticsRes as any).top_products || [],
        });
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !warehouse || !analytics) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    { name: 'Total Revenue', value: `${warehouse.total_sales.toLocaleString()} Br`, change: '+12.5%', icon: DollarSign, color: 'green', isUp: true },
    { name: 'Total Orders', value: warehouse.total_orders.toLocaleString(), change: '+8.2%', icon: ShoppingCart, color: 'blue', isUp: true },
    { name: 'Total Products', value: warehouse.total_products.toLocaleString(), change: '+3', icon: Package, color: 'purple', isUp: true },
    { name: 'Rating', value: warehouse.rating.toFixed(1), change: '+0.2', icon: TrendingUp, color: 'orange', isUp: true },
  ];

  const lowStockItems = inventory.filter(i => i.status === 'low_stock');
  const outOfStockItems = inventory.filter(i => i.status === 'out_of_stock');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-500">Track your warehouse performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stat.color === 'green' ? 'bg-green-50 text-green-600' :
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                'bg-orange-50 text-orange-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.isUp ? 'text-green-600' : 'text-red-600'}`}>
                {stat.isUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm text-gray-500">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Revenue Overview</h2>
          <div className="h-64 flex items-end justify-between gap-2">
            {analytics.weekly_revenue.map((item, idx) => {
              const maxRevenue = Math.max(...analytics.weekly_revenue.map(r => r.revenue));
              const height = (item.revenue / maxRevenue) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{item.date.split(' ')[1]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {analytics.top_products.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                    idx === 1 ? 'bg-gray-100 text-gray-700' :
                    idx === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-50 text-gray-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-900">{product.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{product.revenue.toLocaleString()} Br</p>
                  <p className="text-xs text-gray-500">{product.units} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Status */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Inventory Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">In Stock</p>
            <p className="text-3xl font-bold text-green-700">
              {inventory.filter(i => i.status === 'in_stock').length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-600 font-medium">Low Stock</p>
            <p className="text-3xl font-bold text-yellow-700">{lowStockItems.length}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-600 font-medium">Out of Stock</p>
            <p className="text-3xl font-bold text-red-700">{outOfStockItems.length}</p>
          </div>
        </div>

        {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Products Needing Attention</h3>
            <div className="space-y-2">
              {outOfStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium text-red-700">{item.product_name}</span>
                  <span className="text-sm text-red-600">Out of Stock</span>
                </div>
              ))}
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium text-yellow-700">{item.product_name}</span>
                  <span className="text-sm text-yellow-600">{item.available_stock} left</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Performance Score */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Warehouse Performance</h2>
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#f3f4f6"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#2563eb"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${warehouse.performance_score * 3.52} 350`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{warehouse.performance_score}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-500 mb-4">Your warehouse is performing {warehouse.performance_score >= 90 ? 'excellent' : warehouse.performance_score >= 80 ? 'well' : 'adequately'}.</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Fulfillment</p>
                <p className="font-semibold text-gray-900">98%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer Rating</p>
                <p className="font-semibold text-gray-900">{warehouse.rating}/5.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
