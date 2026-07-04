'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown,
  ArrowUp, Clock, Check, X, ChevronRight, BarChart2, Star
} from 'lucide-react';
import { analyticsApi, ordersApi, productsApi, usersApi, warehousesApi } from '@/lib/api';

const statusColors: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  confirmed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  processing:'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  shipped:   'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  delivered: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingProducts, setPendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [analyticsRes, ordersRes, productsRes] = await Promise.all([
          analyticsApi.get({}),
          ordersApi.list({ limit: 5 }),
          productsApi.list({ status: 'pending', limit: 5 }),
        ]);
        setAnalytics(analyticsRes);
        setOrders(Array.isArray(ordersRes) ? ordersRes.slice(0, 5) : (ordersRes as any).data?.slice(0, 5) || []);
        setPendingProducts(Array.isArray(productsRes) ? productsRes.slice(0, 5) : (productsRes as any).data?.slice(0, 5) || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  const stats = [
    { label: 'Total Revenue', value: `${(analytics?.total_revenue || 254780).toLocaleString()} Br`, sub: '+18.6% vs Apr', isUp: true, icon: DollarSign, border: 'border-t-blue-500', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Total Orders', value: (analytics?.orders?.total || 2450).toLocaleString(), sub: '+12.4% vs Apr', isUp: true, icon: ShoppingCart, border: 'border-t-emerald-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Total Customers', value: (analytics?.customers?.total || 5632).toLocaleString(), sub: '+14.0% vs Apr', isUp: true, icon: Users, border: 'border-t-violet-500', iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
    { label: 'Conversion Rate', value: `${analytics?.conversion_rate || 3.75}%`, sub: '-8.3% vs Apr', isUp: false, icon: TrendingUp, border: 'border-t-amber-500', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  ];

  const categories = analytics?.top_categories || [
    { name: 'Electronics', revenue: 86430, percent: 33.9, bar: 85 },
    { name: 'Fashion', revenue: 62310, percent: 24.4, bar: 61 },
    { name: 'Home & Kitchen', revenue: 41760, percent: 16.4, bar: 41 },
    { name: 'Beauty & Health', revenue: 28640, percent: 11.2, bar: 28 },
    { name: 'Sports', revenue: 18330, percent: 7.1, bar: 18 },
  ];

  const weeklyRevenue = analytics?.weekly_revenue || [];
  const maxRev = weeklyRevenue.length > 0 ? Math.max(...weeklyRevenue.map((r: any) => r.revenue || 0), 1) : 1;

  const orderStatuses = [
    { label: 'Delivered', count: analytics?.orders?.delivered || 302, pct: 60.5, color: '#10b981' },
    { label: 'Processing', count: analytics?.orders?.processing || 188, pct: 37.6, color: '#3b82f6' },
    { label: 'Shipped', count: analytics?.orders?.shipped || 8, pct: 1.6, color: '#8b5cf6' },
    { label: 'Cancelled', count: analytics?.orders?.cancelled || 9, pct: 1.8, color: '#ef4444' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">May 1, 2024 – May 31, 2024</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/products">
            <button className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-600/20">
              <Package className="w-4 h-4" />
              Pending Approvals
              {pendingProducts.length > 0 && <span className="bg-white/30 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingProducts.length}</span>}
            </button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`bg-white rounded-2xl border border-gray-100 border-t-4 ${s.border} p-5 hover:shadow-md hover:-translate-y-0.5 transition-all`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${s.iconColor}`} />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${s.isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {s.isUp ? <ArrowUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.sub.split(' ')[0]}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-gray-900">Revenue Overview</h2>
              <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-0.5 bg-blue-500 rounded block" />Revenue</span>
                <span className="flex items-center gap-1.5 text-xs text-gray-500"><span className="w-3 h-0.5 bg-violet-400 rounded block" />Orders</span>
              </div>
            </div>
            <BarChart2 className="w-5 h-5 text-gray-300" />
          </div>
          <div className="flex items-end gap-1.5 h-36">
            {weeklyRevenue.length > 0 ? weeklyRevenue.map((item: any, i: number) => {
              const h = Math.max(4, (item.revenue / maxRev) * 128);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-sm hover:from-blue-700 hover:to-blue-500 transition-all" style={{ height: h }} />
                  <span className="text-[9px] text-gray-400">{item.date?.split(' ')[1] || i + 1}</span>
                </div>
              );
            }) : ['May 1','May 8','May 15','May 22','May 29'].map((d, i) => {
              const heights = [55, 80, 65, 110, 90];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-sm" style={{ height: heights[i] }} />
                  <span className="text-[9px] text-gray-400">{d}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Orders by Status donut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Orders by Status</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="60.5 39.5" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="37.6 62.4" strokeDashoffset="-60.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="1.6 98.4" strokeDashoffset="-98.1" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-lg font-bold text-gray-900">{orders.length || 500}</p>
                <p className="text-[10px] text-gray-400">Total</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {orderStatuses.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-xs text-gray-600">{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-900">{s.count}</span>
                  <span className="text-[10px] text-gray-400">({s.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row: Top categories + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Top Selling Categories */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Top Selling Categories</h2>
          </div>
          <div className="space-y-3">
            {categories.slice(0, 5).map((cat: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                    <span className="text-xs text-gray-500">{cat.percent || cat.pct || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${cat.bar || cat.percent || 50}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-700 w-20 text-right">{(cat.revenue || 0).toLocaleString()} Br</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/40">
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length > 0 ? orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3 font-bold text-gray-900">#{order.id?.slice(-7).toUpperCase()}</td>
                  <td className="px-5 py-3 text-gray-700">{order.customer_name}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900">{Number(order.total).toLocaleString()} Br</td>
                  <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span></td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                </tr>
              )) : [
                { id: '#MB100251', name: 'John Doe', amount: 125, status: 'delivered', date: 'May 31, 2024' },
                { id: '#MB100250', name: 'Sarah Johnson', amount: 88.5, status: 'processing', date: 'May 31, 2024' },
                { id: '#MB100248', name: 'Michael Brown', amount: 245.75, status: 'shipped', date: 'May 30, 2024' },
                { id: '#MB100247', name: 'Emily Davis', amount: 65, status: 'delivered', date: 'May 30, 2024' },
                { id: '#MB100247', name: 'David Wilson', amount: 150.3, status: 'processing', date: 'May 29, 2024' },
              ].map((order, i) => (
                <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3 font-bold text-gray-900">{order.id}</td>
                  <td className="px-5 py-3 text-gray-700">{order.name}</td>
                  <td className="px-5 py-3 font-semibold text-gray-900">{order.amount.toLocaleString()} Br</td>
                  <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span></td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
