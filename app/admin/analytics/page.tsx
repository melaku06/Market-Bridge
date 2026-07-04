'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Users, TrendingUp, ArrowUp, TrendingDown, BarChart2, ChevronRight } from 'lucide-react';
import { analyticsApi, ordersApi } from '@/lib/api';

const recentOrders = [
  { id: '#MB100251', customer: 'John Doe', amount: 125, status: 'delivered', date: 'May 31, 2024' },
  { id: '#MB100250', customer: 'Sarah Johnson', amount: 88.50, status: 'processing', date: 'May 31, 2024' },
  { id: '#MB100248', customer: 'Michael Brown', amount: 245.75, status: 'shipped', date: 'May 30, 2024' },
  { id: '#MB100247', customer: 'Emily Davis', amount: 65.00, status: 'delivered', date: 'May 30, 2024' },
  { id: '#MB100246', customer: 'David Wilson', amount: 150.30, status: 'processing', date: 'May 29, 2024' },
];

const statusColors: Record<string, string> = {
  delivered:  'bg-emerald-50 text-emerald-700',
  processing: 'bg-amber-50 text-amber-700',
  shipped:    'bg-blue-50 text-blue-700',
  cancelled:  'bg-red-50 text-red-700',
};

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsApi.get({}), ordersApi.list({ limit: 5 })])
      .then(([analyticsRes, ordersRes]) => {
        setAnalytics(analyticsRes);
        setOrders(Array.isArray(ordersRes) ? ordersRes.slice(0, 5) : (ordersRes as any).data?.slice(0, 5) || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  const stats = [
    { label: 'Total Revenue', value: `$${((analytics?.total_revenue || 254780) / 1000).toFixed(0)}K`, sub: '+12.4% vs Apr', isUp: true, icon: DollarSign, iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Total Orders', value: (analytics?.orders?.total || 2450).toLocaleString(), sub: '+14.8% vs Apr', isUp: true, icon: ShoppingCart, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Total Customers', value: (analytics?.customers?.total || 5632).toLocaleString(), sub: '-8.3% vs Apr', isUp: false, icon: Users, iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
    { label: 'Conversion Rate', value: `${analytics?.conversion_rate || '3.75'}%`, sub: '+8.3% vs Apr', isUp: true, icon: TrendingUp, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  ];

  const categories = analytics?.top_categories || [
    { name: 'Electronics', revenue: 86430, percent: 33.9 },
    { name: 'Fashion', revenue: 62310, percent: 24.4 },
    { name: 'Home & Kitchen', revenue: 41760, percent: 16.4 },
    { name: 'Beauty & Health', revenue: 28640, percent: 11.2 },
    { name: 'Sports', revenue: 18330, percent: 7.1 },
  ];

  const orderStatuses = [
    { label: 'Delivered', count: analytics?.orders?.delivered || 660, pct: 27.6, color: '#10b981' },
    { label: 'Processing', count: analytics?.orders?.processing || 302, pct: 12.6, color: '#f59e0b' },
    { label: 'Shipped', count: analytics?.orders?.shipped || 302, pct: 12.6, color: '#3b82f6' },
    { label: 'Cancelled', count: analytics?.orders?.cancelled || 130, pct: 5.2, color: '#ef4444' },
  ];

  const chartDates = ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'];
  const chartHeights = [55, 80, 65, 130, 100];

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">May 1, 2024 – May 31, 2024</p>
        </div>
        <select className="text-[13px] border border-gray-200 rounded-lg px-3 py-2 text-gray-600 bg-white focus:outline-none">
          <option>Last 30 days</option>
          <option>Last 7 days</option>
          <option>This year</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => { const Icon = s.icon; return (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 ${s.iconBg} rounded-lg flex items-center justify-center`}><Icon className={s.iconColor} style={{ width: 15, height: 15 }} /></div>
              <span className={`flex items-center gap-0.5 text-[11px] font-semibold ${s.isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                {s.isUp ? <ArrowUp style={{ width: 11, height: 11 }} /> : <TrendingDown style={{ width: 11, height: 11 }} />}
                {s.sub.split(' ')[0]}
              </span>
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-[12px] font-semibold text-gray-700 mt-0.5">{s.label}</p>
            <p className="text-[11px] text-gray-400">{s.sub}</p>
          </div>
        );})}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Revenue Overview</h2>
              <div className="flex items-center gap-4 mt-1">
                <span className="flex items-center gap-1.5 text-[11px] text-gray-400"><span className="w-3 h-0.5 bg-blue-500 rounded block" />Revenue</span>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-400"><span className="w-3 h-0.5 bg-violet-400 rounded block" />Orders</span>
              </div>
            </div>
            <select className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 text-gray-500 bg-white focus:outline-none"><option>This Month</option></select>
          </div>
          <div className="relative h-36">
            <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[9px] text-gray-400 pr-2">
              <span>330k</span>
              <span>220k</span>
              <span>110k</span>
              <span>0</span>
            </div>
            <div className="ml-8 flex items-end gap-2 h-full border-b border-gray-100">
              {chartDates.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t opacity-80 hover:opacity-100 transition-opacity" style={{ height: chartHeights[i] }} />
                  <span className="text-[9px] text-gray-400">{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">Orders by Status</h2>
            <select className="text-[11px] border border-gray-200 rounded-lg px-2 py-1 text-gray-500 bg-white focus:outline-none"><option>This Month</option></select>
          </div>
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray="27.6 72.4" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="12.6 87.4" strokeDashoffset="-27.6" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeDasharray="12.6 87.4" strokeDashoffset="-40.2" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="5.2 94.8" strokeDashoffset="-52.8" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-base font-bold text-gray-900">{(analytics?.orders?.total || 2450).toLocaleString()}</p>
                <p className="text-[9px] text-gray-400">Total</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {orderStatuses.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-[12px] text-gray-600">{s.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-gray-900">{s.count}</span>
                  <span className="text-[10px] text-gray-400">({s.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Top Categories */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Top Selling Categories</h2>
          <div className="space-y-3">
            {categories.slice(0, 5).map((cat: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[11px] font-bold text-gray-400 w-4">{i + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-medium text-gray-900">{cat.name}</span>
                    <span className="text-[11px] text-gray-500">{cat.percent || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${cat.percent || cat.bar || 50}%` }} />
                  </div>
                </div>
                <span className="text-[12px] font-semibold text-gray-700 w-20 text-right">${(cat.revenue || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Recent Orders</h2>
            <button className="text-[11px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ChevronRight style={{ width: 13, height: 13 }} />
            </button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/40">
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-5 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(orders.length > 0 ? orders : recentOrders).map((order: any, i: number) => (
                <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3 text-[13px] font-bold text-gray-900">{order.id?.startsWith('#') ? order.id : `#MB${order.id?.slice(-5).toUpperCase() || i}`}</td>
                  <td className="px-5 py-3 text-[13px] text-gray-700">{order.customer || order.customer_name}</td>
                  <td className="px-5 py-3 text-[13px] font-semibold text-gray-900">${(order.amount || order.total || 0).toLocaleString()}</td>
                  <td className="px-5 py-3"><span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span></td>
                  <td className="px-5 py-3 text-[12px] text-gray-500">{order.date || new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
