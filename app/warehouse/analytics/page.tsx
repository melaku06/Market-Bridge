'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { analyticsApi, inventoryApi, ordersApi, warehousesApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';

const FALLBACK_BARS = [
  { l: 'Jan', v: 42 }, { l: 'Feb', v: 63 }, { l: 'Mar', v: 55 }, { l: 'Apr', v: 78 },
  { l: 'May', v: 68 }, { l: 'Jun', v: 91 }, { l: 'Jul', v: 72 }, { l: 'Aug', v: 88 },
];
const TOP_PRODUCTS_FALLBACK = [
  { name: 'Wireless Earbuds Pro', units: 342, revenue: 85500 },
  { name: 'Smart Watch Series X', units: 289, revenue: 72250 },
  { name: 'Premium Backpack', units: 215, revenue: 32250 },
  { name: 'Bluetooth Speaker', units: 198, revenue: 19800 },
  { name: 'Portable Charger', units: 156, revenue: 10920 },
];
const CATEGORIES_FALLBACK = [
  { name: 'Electronics', pct: 49, color: '#7c3aed' },
  { name: 'Fashion', pct: 28, color: '#3b82f6' },
  { name: 'Footwear', pct: 14, color: '#10b981' },
  { name: 'Home & Kitchen', pct: 9, color: '#f59e0b' },
];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('This Month');

  useEffect(() => {
    const wid = user?.warehouse_id;
    if (!wid) return;
    Promise.all([
      analyticsApi.get({ warehouse_id: wid }),
      ordersApi.list({ warehouse_id: wid }),
    ]).then(([a, o]) => {
      setAnalytics(a);
      setOrders(Array.isArray(o) ? o : (o as any).data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [user?.warehouse_id]);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const totalRevenue = analytics?.revenue?.total || 0;
  const monthRevenue = analytics?.revenue?.month || 0;
  const totalOrders = analytics?.orders?.total || orders.length;
  const avgOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const totalCustomers = analytics?.orders?.active || Math.round(totalOrders * 0.7);

  const stats = [
    { label: 'Total Revenue', value: `${Number(totalRevenue).toLocaleString()} Br`, change: '+18.3%', up: true, icon: DollarSign, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { label: 'Total Orders', value: totalOrders, change: '+12.5%', up: true, icon: ShoppingCart, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Avg. Order Value', value: `${avgOrder.toFixed(0)} Br`, change: '+4.2%', up: true, icon: TrendingUp, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
    { label: 'Total Customers', value: totalCustomers, change: '-2.1%', up: false, icon: Users, iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
  ];

  const weeklyRevenue: Array<{ date: string; revenue: number }> = analytics?.weekly_revenue || [];
  const maxRev = Math.max(...weeklyRevenue.map(r => r.revenue), 1);
  const bars = weeklyRevenue.length > 0
    ? weeklyRevenue.map((r, i) => ({ l: r.date?.split(' ')?.[1] || String(i + 1), v: Math.max(4, (r.revenue / maxRev) * 160), active: i === weeklyRevenue.length - 1 }))
    : FALLBACK_BARS.map((b, i) => ({ l: b.l, v: b.v / 100 * 160, active: i === FALLBACK_BARS.length - 1 }));

  const statusCounts = {
    pending: orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  const DONUT_SEGS = [
    { label: 'Pending', count: statusCounts.pending, color: '#f59e0b' },
    { label: 'Processing', count: statusCounts.processing, color: '#8b5cf6' },
    { label: 'Shipped', count: statusCounts.shipped, color: '#3b82f6' },
    { label: 'Delivered', count: statusCounts.delivered, color: '#10b981' },
    { label: 'Cancelled', count: statusCounts.cancelled, color: '#ef4444' },
  ];
  const totalDonut = Math.max(orders.length, 1);
  const CIRC = 2 * Math.PI * 38;
  let offset = 0;

  const topProducts = analytics?.top_products || TOP_PRODUCTS_FALLBACK;
  const maxUnits = Math.max(...topProducts.map((p: any) => p.units || p.total_orders || 1), 1);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Performance insights for your warehouse</p>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 text-gray-600 focus:outline-none focus:border-purple-400 bg-white cursor-pointer shadow-sm">
          {['This Week', 'This Month', 'Last 3 Months', 'This Year'].map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center`}>
                  <Icon className={s.iconColor} style={{ width: 18, height: 18 }} />
                </div>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${s.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {s.up ? <TrendingUp style={{ width: 10, height: 10 }} /> : <TrendingDown style={{ width: 10, height: 10 }} />}
                  {s.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Monthly revenue trend</p>
            </div>
          </div>
          <div className="flex items-end gap-2 h-48">
            {bars.map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <div className="relative w-full rounded-xl transition-all group-hover:opacity-90 cursor-pointer"
                  style={{
                    height: `${bar.v}px`,
                    background: bar.active
                      ? 'linear-gradient(180deg,#a855f7,#7c3aed)'
                      : 'linear-gradient(180deg,#ede9fe,#ddd6fe)',
                  }} />
                <span className="text-[10px] text-gray-400">{bar.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Order Status</h2>
          <p className="text-xs text-gray-400 mb-4">Distribution breakdown</p>
          <div className="flex justify-center mb-4">
            <svg width="110" height="110" viewBox="0 0 110 110">
              <circle cx="55" cy="55" r="38" fill="none" stroke="#f3f4f6" strokeWidth="14" />
              {DONUT_SEGS.map((seg, idx) => {
                const len = (seg.count / totalDonut) * CIRC;
                const el = (
                  <circle key={idx} cx="55" cy="55" r="38" fill="none"
                    stroke={seg.color} strokeWidth="14"
                    strokeDasharray={`${len} ${CIRC - len}`}
                    strokeDashoffset={-offset}
                    transform="rotate(-90 55 55)"
                    strokeLinecap="round" />
                );
                offset += len;
                return el;
              })}
              <text x="55" y="51" textAnchor="middle" fontSize="16" fontWeight="700" fill="#111827">{orders.length}</text>
              <text x="55" y="63" textAnchor="middle" fontSize="9" fill="#9ca3af">orders</text>
            </svg>
          </div>
          <div className="space-y-2">
            {DONUT_SEGS.map(seg => (
              <div key={seg.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                  <span className="text-xs text-gray-600">{seg.label}</span>
                </div>
                <span className="text-xs font-semibold text-gray-700">{seg.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Selling */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {topProducts.slice(0, 5).map((p: any, i: number) => {
              const units = p.units || p.total_orders || 0;
              const rev = p.revenue || p.total_revenue || 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-lg bg-purple-50 text-purple-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <span className="text-sm text-gray-700 truncate">{p.name || p.product_name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-900 flex-shrink-0 ml-2">{Number(rev).toFixed(0)} Br</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(units / maxUnits) * 100}%`, background: 'linear-gradient(90deg,#7c3aed,#a855f7)' }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{units} units sold</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Sales by Category</h2>
          <div className="space-y-4">
            {CATEGORIES_FALLBACK.map(c => (
              <div key={c.name}>
                <div className="flex justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-sm text-gray-700">{c.name}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-800">{c.pct}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${c.pct}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
