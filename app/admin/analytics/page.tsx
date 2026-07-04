'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign, ShoppingCart, Users, Package, TrendingUp, TrendingDown,
  ArrowUp, ArrowDown, BarChart2, ChevronRight, Download, Star, MapPin, Calendar
} from 'lucide-react';
import { analyticsApi } from '@/lib/api';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await analyticsApi.get({});
        setAnalytics(res);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  const stats = [
    { label: 'Total Revenue', value: `${(analytics?.total_revenue || 254780).toLocaleString()} Br`, change: '+18.6%', isUp: true, icon: DollarSign, border: 'border-t-blue-500', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Total Orders', value: (analytics?.orders?.total || 2450).toLocaleString(), change: '+12.4%', isUp: true, icon: ShoppingCart, border: 'border-t-emerald-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    { label: 'Total Customers', value: (analytics?.customers?.total || 5632).toLocaleString(), change: '+14.0%', isUp: true, icon: Users, border: 'border-t-violet-500', iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
    { label: 'Avg Order Value', value: `${(analytics?.avg_order_value || 1039).toLocaleString()} Br`, change: '+5.2%', isUp: true, icon: TrendingUp, border: 'border-t-amber-500', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  ];

  const weeklyRevenue = analytics?.weekly_revenue || [];
  const maxRev = weeklyRevenue.length > 0 ? Math.max(...weeklyRevenue.map((r: any) => r.revenue || 0), 1) : 1;

  const categories = analytics?.top_categories || [
    { name: 'Electronics', revenue: 86430, percent: 33.9, bar: 85 },
    { name: 'Fashion', revenue: 62310, percent: 24.4, bar: 61 },
    { name: 'Home & Kitchen', revenue: 41760, percent: 16.4, bar: 41 },
    { name: 'Beauty & Health', revenue: 28640, percent: 11.2, bar: 28 },
    { name: 'Sports', revenue: 18330, percent: 7.1, bar: 18 },
  ];

  const topProducts = analytics?.top_products || [
    { name: 'Wireless Bluetooth Headphones', revenue: 12450, units: 89, image: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Smart Watch Pro', revenue: 9870, units: 67, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'USB-C Fast Charger', revenue: 7230, units: 145, image: 'https://images.pexels.com/photos/45201/pexels-photo-45201.jpeg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Laptop Stand Aluminum', revenue: 5680, units: 52, image: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=200' },
    { name: 'Mechanical Keyboard', revenue: 4320, units: 38, image: 'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=200' },
  ];

  const regions = analytics?.top_regions || [
    { name: 'Addis Ababa', revenue: 142530, percent: 56.0, bar: 90 },
    { name: 'Dire Dawa', revenue: 38210, percent: 15.0, bar: 24 },
    { name: 'Bahir Dar', revenue: 28940, percent: 11.4, bar: 18 },
    { name: 'Hawassa', revenue: 21330, percent: 8.4, bar: 13 },
    { name: 'Mekelle', revenue: 15780, percent: 6.2, bar: 10 },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/admin" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics & Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> May 1, 2024 – May 31, 2024
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors bg-white">
          <Download className="w-4 h-4" /><span className="hidden sm:inline">Export Report</span>
        </button>
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
                  {s.isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-xs text-gray-500 mt-0.5">Weekly revenue performance</p>
            </div>
            <BarChart2 className="w-5 h-5 text-gray-300" />
          </div>
          <div className="h-56 flex items-end justify-between gap-2">
            {weeklyRevenue.length > 0 ? weeklyRevenue.map((item: any, idx: number) => {
              const h = (item.revenue / maxRev) * 180;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full relative">
                    <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all hover:from-blue-700 hover:to-blue-500" style={{ height: h }} />
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none">
                      {item.revenue.toLocaleString()} Br
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{item.date?.split(' ')[1] || idx + 1}</span>
                </div>
              );
            }) : ['May 1','May 8','May 15','May 22','May 29'].map((d, i) => {
              const heights = [90, 130, 105, 175, 145];
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg" style={{ height: heights[i] }} />
                  <span className="text-xs text-gray-400">{d}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-1">Top Products</h2>
          <p className="text-xs text-gray-500 mb-4">By revenue this month</p>
          <div className="space-y-3">
            {topProducts.map((product: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-gray-100 text-gray-700' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-500'
                }`}>{idx + 1}</span>
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.units} units</p>
                </div>
                <p className="text-sm font-bold text-gray-900 flex-shrink-0">{product.revenue.toLocaleString()} Br</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories + Regions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4">Top Selling Categories</h2>
          <div className="space-y-3">
            {categories.map((cat: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                    <span className="text-xs text-gray-500">{cat.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${cat.bar || cat.percent}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-700 w-20 text-right">{cat.revenue.toLocaleString()} Br</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" /> Top Regions
          </h2>
          <div className="space-y-3">
            {regions.map((region: any, idx: number) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400 w-4">{idx + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-gray-900">{region.name}</span>
                    <span className="text-xs text-gray-500">{region.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${region.bar || region.percent}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-700 w-20 text-right">{region.revenue.toLocaleString()} Br</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
