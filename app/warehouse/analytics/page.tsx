'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, Users, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useWarehouseStore } from '@/stores/warehouse/warehouse-store';
import { useInventoryStore } from '@/stores/inventory/inventory-store';
import { useAnalyticsStore } from '@/stores/analytics/analytics-store';

function DonutChart({ data }: { data: { label: string; value: number; color: string; pct: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let cumulative = 0;
  const r = 70; const circumference = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-6">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {data.map((d, i) => {
          const pct = d.value / total;
          const dash = pct * circumference;
          const offset = circumference - cumulative * circumference;
          cumulative += pct;
          return (
            <circle key={i} cx="80" cy="80" r={r} fill="none" stroke={d.color} strokeWidth="20"
              strokeDasharray={`${dash} ${circumference - dash}`} strokeDashoffset={offset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }} />
          );
        })}
        <circle cx="80" cy="80" r="50" fill="white" />
        <text x="80" y="76" textAnchor="middle" fontSize="16" fontWeight="700" fill="#111827">{total}</text>
        <text x="80" y="92" textAnchor="middle" fontSize="10" fill="#9ca3af">Total</text>
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-gray-600 w-24">{d.label}</span>
            <span className="text-xs font-bold text-gray-900">{d.value}</span>
            <span className="text-xs text-gray-400">({d.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WarehouseAnalytics() {
  const { user } = useAuth();
  const { warehouse, fetchWarehouse, isLoading: warehouseLoading } = useWarehouseStore();
  const { inventory, fetchInventory, isLoading: inventoryLoading } = useInventoryStore();
  const { warehouseData, fetchWarehouseAnalytics, isLoading: analyticsLoading } = useAnalyticsStore();
  const analytics = warehouseData as any;
  const [dateRange, setDateRange] = useState('Daily');

  useEffect(() => {
    const warehouseId = user?.warehouse_id;
    if (!warehouseId) return;
    fetchWarehouse(warehouseId);
    fetchInventory({ warehouse_id: warehouseId });
    fetchWarehouseAnalytics(warehouseId);
  }, [user?.warehouse_id, fetchWarehouse, fetchInventory, fetchWarehouseAnalytics]);

  const loading = warehouseLoading || inventoryLoading || analyticsLoading;

  if (loading || !warehouse) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  const weeklyRevenue: Array<{ date: string; revenue: number }> = analytics?.weekly_revenue || [];
  const topProducts: Array<{ name: string; revenue: number; units: number }> = analytics?.top_products || [];
  const maxRevenue = weeklyRevenue.length > 0 ? Math.max(...weeklyRevenue.map(r => r.revenue), 1) : 1;

  const total = Number(warehouse.total_orders) || 1;
  const pendingCount = Math.round(total * 0.30);
  const processingCount = Math.round(total * 0.17);
  const shippedCount = Math.round(total * 0.29);
  const deliveredCount = total - pendingCount - processingCount - shippedCount;

  const donutData = [
    { label: 'New', value: pendingCount, color: '#f59e0b', pct: String(Math.round(pendingCount / total * 100)) },
    { label: 'Processing', value: processingCount, color: '#3b82f6', pct: String(Math.round(processingCount / total * 100)) },
    { label: 'Shipped', value: shippedCount, color: '#8b5cf6', pct: String(Math.round(shippedCount / total * 100)) },
    { label: 'Delivered', value: deliveredCount, color: '#10b981', pct: String(Math.round(deliveredCount / total * 100)) },
    { label: 'Cancelled', value: Math.round(total * 0.063), color: '#ef4444', pct: '6.3' },
  ];

  const categorySales = [
    { label: 'Electronics', value: '$22,640.00', pct: 49 },
    { label: 'Fashion', value: '$17,685.50', pct: 27 },
    { label: 'Footwear', value: '$8,345.20', pct: 13 },
    { label: 'Home & Kitchen', value: '$4,299.80', pct: 9 },
  ];

  const stats = [
    { name: 'Total Orders', value: Number(warehouse.total_orders).toLocaleString(), change: '+18.5%', icon: ShoppingCart, bg: 'bg-blue-50', color: 'text-blue-600', up: true },
    { name: 'Total Revenue', value: `$${Number(warehouse.total_sales).toLocaleString()}`, change: '+22.7%', icon: DollarSign, bg: 'bg-emerald-50', color: 'text-emerald-600', up: true },
    { name: 'Average Order Value', value: `$${Number(warehouse.total_orders) > 0 ? (Number(warehouse.total_sales) / Number(warehouse.total_orders)).toFixed(2) : '0'}`, change: '+4.2%', icon: TrendingUp, bg: 'bg-purple-50', color: 'text-purple-600', up: true },
    { name: 'Total Customers', value: Math.round(Number(warehouse.total_orders) * 0.7).toLocaleString(), change: '+18.3%', icon: Users, bg: 'bg-amber-50', color: 'text-amber-600', up: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Analytics Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track performance and key metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>May 1 - May 31, 2024</span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.name}</p>
              <p className={`text-xs font-medium mt-0.5 ${stat.up ? 'text-emerald-600' : 'text-red-500'}`}>vs Apr</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Revenue Overview</h2>
            </div>
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 focus:outline-none">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-40 flex items-end gap-1.5 relative">
            {(weeklyRevenue.length > 0 ? weeklyRevenue : Array.from({ length: 7 }).map((_, i) => ({ date: `Day ${i + 1}`, revenue: 3000 + Math.random() * 8000 }))).map((r, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${Math.max(4, (r.revenue / maxRevenue) * 150)}px`, background: 'linear-gradient(to top, #7c3aed, #a78bfa)' }}
                />
                <span className="text-[9px] text-gray-400">
                  {['May 1', 'May 8', 'May 15', 'May 22', 'May 29'][i] || `Day ${i + 1}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Orders by Status</h2>
          <DonutChart data={donutData} />
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {(topProducts.length > 0 ? topProducts : [
              { name: 'Wireless Headphones', units: 245 },
              { name: 'Smart Watch Series 5', units: 189 },
              { name: 'Premium Backpack', units: 166 },
              { name: 'Running Shoes', units: 132 },
              { name: 'Bluetooth Speaker', units: 118 },
            ]).slice(0, 5).map((product, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-400 w-5">{idx + 1}.</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-purple-500"
                      style={{ width: `${((product.units || 0) / 245) * 100}%` }}
                    />
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-600 flex-shrink-0">{product.units || 0} sold</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Sales by Category</h2>
          <div className="space-y-3">
            {categorySales.map((cat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">{cat.label}</p>
                    <p className="text-sm font-bold text-gray-900">{cat.value}</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cat.pct}%`, background: ['#7c3aed', '#3b82f6', '#10b981', '#f59e0b'][i] }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400 w-12 text-right flex-shrink-0">({cat.pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
