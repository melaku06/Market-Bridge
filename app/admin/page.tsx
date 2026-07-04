'use client';

import { useEffect, useState } from 'react';
import { Package, DollarSign, Users, Warehouse as WarehouseIcon, ShoppingBag, ArrowUp, ArrowDown, ChevronRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { productsApi, warehousesApi, analyticsApi } from '@/lib/api';
import type { Product, Warehouse } from '@/lib/types';

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
        setAnalytics(analyticsRes as any);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  const pendingProducts = products.filter(p => p.status === 'pending');
  const activeWarehouses = warehouses.filter(w => w.status === 'active');
  const pendingWarehouses = warehouses.filter(w => w.status === 'pending_approval');

  const stats = [
    { name: 'Total Revenue', value: `${analytics.revenue.total.toLocaleString()} Br`, change: '+12.5%', icon: DollarSign, color: 'emerald', isUp: true },
    { name: 'Total Orders', value: analytics.orders.total.toLocaleString(), change: '+8.2%', icon: ShoppingBag, color: 'indigo', isUp: true },
    { name: 'Customers', value: analytics.customers.total.toLocaleString(), change: '+234 today', icon: Users, color: 'purple', isUp: true },
    { name: 'Active Warehouses', value: activeWarehouses.length.toString(), icon: WarehouseIcon, color: 'amber', isUp: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-0.5">Welcome back, Admin</p>
      </div>

      {/* Alerts */}
      {(pendingProducts.length > 0 || pendingWarehouses.length > 0) && (
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100 rounded-2xl p-5">
          <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Items Requiring Attention
          </h3>
          <div className="flex gap-3 flex-wrap">
            {pendingProducts.length > 0 && (
              <Link
                href="/admin/products"
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-violet-200 text-violet-700 hover:bg-violet-100 transition-colors shadow-sm"
              >
                <Package className="w-4 h-4" />
                {pendingProducts.length} pending product approvals
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            )}
            {pendingWarehouses.length > 0 && (
              <Link
                href="/admin/warehouses"
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-violet-200 text-violet-700 hover:bg-violet-100 transition-colors shadow-sm"
              >
                <WarehouseIcon className="w-4 h-4" />
                {pendingWarehouses.length} pending warehouse applications
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                stat.color === 'indigo' ? 'bg-violet-50 text-violet-600' :
                stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.isUp ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.isUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-6">Weekly Revenue</h2>
          <div className="h-64 flex items-end justify-between gap-3">
            {analytics.weekly_revenue.map((item, idx) => {
              const maxRevenue = Math.max(...analytics.weekly_revenue.map(r => r.revenue));
              const height = (item.revenue / maxRevenue) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-violet-500 to-violet-400 rounded-lg transition-all hover:from-violet-600 hover:to-violet-500 shadow-sm"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2 font-medium">{item.date.split(' ')[1]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-6">Order Status Overview</h2>
          <div className="space-y-4">
            {analytics.order_status_overview.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{item.status}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full transition-all ${
                        item.status === 'Delivered' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                        item.status === 'Processing' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                        item.status === 'Shipped' ? 'bg-gradient-to-r from-violet-400 to-violet-500' :
                        item.status === 'Cancelled' ? 'bg-gradient-to-r from-red-400 to-red-500' :
                        'bg-gradient-to-r from-amber-400 to-amber-500'
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
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-5">Top Selling Products</h2>
          <div className="space-y-3">
            {analytics.top_products.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm ${
                    idx === 0 ? 'bg-gradient-to-br from-yellow-100 to-amber-100 text-amber-700' :
                    idx === 1 ? 'bg-gradient-to-br from-gray-100 to-slate-100 text-slate-700' :
                    idx === 2 ? 'bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-900">{product.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{product.revenue.toLocaleString()} Br</p>
                  <p className="text-xs text-gray-500 mt-0.5">{product.units} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-5">Sales by Category</h2>
          <div className="space-y-3">
            {analytics.sales_by_category.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <span className="font-medium text-gray-900">{cat.name}</span>
                <div className="flex items-center gap-4">
                  <p className="font-semibold text-gray-900">{cat.revenue.toLocaleString()} Br</p>
                  <span className="px-2.5 py-1 bg-violet-50 text-violet-600 rounded-lg text-xs font-semibold">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <Link href="/admin/products" className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-indigo-300 hover:shadow-lg transition-all text-center shadow-sm group">
          <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-violet-100 transition-colors">
            <Package className="w-7 h-7 text-violet-600" />
          </div>
          <p className="font-semibold text-gray-900">Product Approval</p>
          <p className="text-sm text-gray-500 mt-1">{pendingProducts.length} pending</p>
        </Link>
        <Link href="/admin/warehouses" className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-purple-300 hover:shadow-lg transition-all text-center shadow-sm group">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-100 transition-colors">
            <WarehouseIcon className="w-7 h-7 text-purple-600" />
          </div>
          <p className="font-semibold text-gray-900">Warehouses</p>
          <p className="text-sm text-gray-500 mt-1">{warehouses.length} total</p>
        </Link>
        <Link href="/admin/customers" className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-emerald-300 hover:shadow-lg transition-all text-center shadow-sm group">
          <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-emerald-100 transition-colors">
            <Users className="w-7 h-7 text-emerald-600" />
          </div>
          <p className="font-semibold text-gray-900">Customers</p>
          <p className="text-sm text-gray-500 mt-1">{analytics.customers.total.toLocaleString()} total</p>
        </Link>
        <Link href="/admin/orders" className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-amber-300 hover:shadow-lg transition-all text-center shadow-sm group">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-amber-100 transition-colors">
            <ShoppingBag className="w-7 h-7 text-amber-600" />
          </div>
          <p className="font-semibold text-gray-900">Orders</p>
          <p className="text-sm text-gray-500 mt-1">{analytics.orders.total.toLocaleString()} total</p>
        </Link>
      </div>
    </div>
  );
}
