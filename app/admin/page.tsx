'use client';

import { useEffect, useState } from 'react';
import { Package, DollarSign, Users, Warehouse as WarehouseIcon, ShoppingBag, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { productsApi, warehousesApi, analyticsApi } from '@/lib/api';
import type { Product, Warehouse } from '@/lib/mock-db';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [analytics, setAnalytics] = useState<{
    revenue: { total: number };
    orders: { total: number };
    customers: { total: number };
    weekly_revenue: Array<{ date: string; revenue: number }>;
    order_status_overview: Array<{ status: string; count: number; percentage: number }>;
    top_products: Array<{ name: string; revenue: number; units: number }>;
    sales_by_category: Array<{ name: string; revenue: number; percentage: number }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, warehousesRes, analyticsRes] = await Promise.all([
          productsApi.list({}),
          warehousesApi.list({}),
          analyticsApi.get({}),
        ]);
        const productsData = Array.isArray(productsRes) ? productsRes : (productsRes as { data?: Product[] }).data || [];
        const warehousesData = Array.isArray(warehousesRes) ? warehousesRes : (warehousesRes as { data?: Warehouse[] }).data || [];
        setProducts(productsData);
        setWarehouses(warehousesData);
        setAnalytics(analyticsRes);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const pendingProducts = products.filter(p => p.status === 'pending');
  const activeWarehouses = warehouses.filter(w => w.status === 'active');
  const pendingWarehouses = warehouses.filter(w => w.status === 'pending_approval');

  const stats = [
    { name: 'Total Revenue', value: `$${analytics.revenue.total.toLocaleString()}`, change: '+12.5%', icon: DollarSign, color: 'green', isUp: true },
    { name: 'Total Orders', value: analytics.orders.total.toLocaleString(), change: '+8.2%', icon: ShoppingBag, color: 'blue', isUp: true },
    { name: 'Customers', value: analytics.customers.total.toLocaleString(), change: '+234 today', icon: Users, color: 'purple', isUp: true },
    { name: 'Active Warehouses', value: activeWarehouses.length.toString(), icon: WarehouseIcon, color: 'orange', isUp: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin</p>
      </div>

      {/* Alerts */}
      {(pendingProducts.length > 0 || pendingWarehouses.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Items Requiring Attention</h3>
          <div className="flex gap-4">
            {pendingProducts.length > 0 && (
              <Link
                href="/admin/products"
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <Package className="w-4 h-4" />
                {pendingProducts.length} pending product approvals
              </Link>
            )}
            {pendingWarehouses.length > 0 && (
              <Link
                href="/admin/warehouses"
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors"
              >
                <WarehouseIcon className="w-4 h-4" />
                {pendingWarehouses.length} pending warehouse applications
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
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

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Weekly Revenue</h2>
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

        {/* Order Status Overview */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Order Status Overview</h2>
          <div className="space-y-4">
            {analytics.order_status_overview.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.status}</span>
                    <span className="text-sm text-gray-500">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.status === 'Delivered' ? 'bg-green-500' :
                        item.status === 'Processing' ? 'bg-blue-500' :
                        item.status === 'Shipped' ? 'bg-indigo-500' :
                        item.status === 'Cancelled' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Sales by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {analytics.top_products.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                    idx === 1 ? 'bg-gray-200 text-gray-700' :
                    idx === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-900">{product.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${product.revenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{product.units} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Sales by Category</h2>
          <div className="space-y-3">
            {analytics.sales_by_category.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{cat.name}</span>
                <div className="flex items-center gap-4">
                  <p className="font-medium text-gray-900">${cat.revenue.toFixed(2)}</p>
                  <span className="text-xs text-gray-500">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/admin/products" className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-300 hover:shadow-md transition-all text-center">
          <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Product Approval</p>
          <p className="text-sm text-gray-500">{pendingProducts.length} pending</p>
        </Link>
        <Link href="/admin/warehouses" className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-300 hover:shadow-md transition-all text-center">
          <WarehouseIcon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Warehouses</p>
          <p className="text-sm text-gray-500">{warehouses.length} total</p>
        </Link>
        <Link href="/admin/customers" className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-300 hover:shadow-md transition-all text-center">
          <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Customers</p>
          <p className="text-sm text-gray-500">{analytics.customers.total.toLocaleString()} total</p>
        </Link>
        <Link href="/admin/orders" className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-300 hover:shadow-md transition-all text-center">
          <ShoppingBag className="w-8 h-8 text-orange-600 mx-auto mb-2" />
          <p className="font-medium text-gray-900">Orders</p>
          <p className="text-sm text-gray-500">{analytics.orders.total.toLocaleString()} total</p>
        </Link>
      </div>
    </div>
  );
}
