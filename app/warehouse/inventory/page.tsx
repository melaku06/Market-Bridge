'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Package, AlertTriangle, Edit2, TrendingUp, TrendingDown, X, CheckCircle2 } from 'lucide-react';
import { inventoryApi, productsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Inventory, Product } from '@/lib/types';

const TABS = ['All Inventory', 'Low Stock', 'Out of Stock'] as const;
type Tab = typeof TABS[number];

const STATUS_BADGE: Record<string, string> = {
  in_stock: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  low_stock: 'bg-amber-50 text-amber-700 border border-amber-100',
  out_of_stock: 'bg-red-50 text-red-700 border border-red-100',
};

export default function InventoryPage() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('All Inventory');
  const [adjustItem, setAdjustItem] = useState<Inventory | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetch() {
      const wid = user?.warehouse_id;
      if (!wid) return;
      try {
        const [ir, pr] = await Promise.all([
          inventoryApi.list({ warehouse_id: wid }),
          productsApi.list({ warehouse_id: wid }),
        ]);
        setInventory(Array.isArray(ir) ? ir : (ir as any).data || []);
        setProducts(Array.isArray(pr) ? pr : (pr as any).data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    if (user?.warehouse_id) fetch();
  }, [user?.warehouse_id]);

  const getProduct = (id: string) => products.find(p => p.id === id);

  const tabFilter = (item: Inventory) => {
    if (activeTab === 'Low Stock') return item.status === 'low_stock';
    if (activeTab === 'Out of Stock') return item.status === 'out_of_stock';
    return true;
  };

  const filtered = inventory.filter(i =>
    tabFilter(i) &&
    (search === '' || i.product_name?.toLowerCase().includes(search.toLowerCase()) || i.sku?.toLowerCase().includes(search.toLowerCase()))
  );

  const stats = {
    total: inventory.length,
    totalUnits: inventory.reduce((a, i) => a + (i.total_stock || 0), 0),
    low: inventory.filter(i => i.status === 'low_stock').length,
    out: inventory.filter(i => i.status === 'out_of_stock').length,
  };

  const openAdjust = (item: Inventory) => {
    setAdjustItem(item);
    setAdjustQty(item.total_stock || 0);
  };

  const saveAdjust = async () => {
    if (!adjustItem) return;
    setSaving(true);
    const reserved = adjustItem.reserved_stock || 0;
    const available = Math.max(0, adjustQty - reserved);
    const status = adjustQty === 0 ? 'out_of_stock' : available <= (adjustItem.low_stock_threshold || 10) ? 'low_stock' : 'in_stock';
    try {
      await inventoryApi.update(adjustItem.id, { total_stock: adjustQty, available_stock: available, status });
      setInventory(inv => inv.map(i => i.id === adjustItem.id ? { ...i, total_stock: adjustQty, available_stock: available, status } : i));
      setAdjustItem(null);
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track stock levels across your product catalog</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: stats.total, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Total Units', value: stats.totalUnits, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Low Stock', value: stats.low, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Out of Stock', value: stats.out, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-100' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={s.color} style={{ width: 18, height: 18 }} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
        {/* Inventory Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-5 gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-5 py-3 border-b border-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 13, height: 13 }} />
              <input type="text" placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-4 h-9 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/70">
                  {['Product', 'SKU', 'Total', 'Reserved', 'Available', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-14 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <Package style={{ width: 36, height: 36 }} />
                      <p className="text-sm">No inventory items found</p>
                    </div>
                  </td></tr>
                ) : filtered.map(item => {
                  const pct = item.total_stock > 0 ? Math.min(100, (item.available_stock / item.total_stock) * 100) : 0;
                  const barColor = pct > 50 ? '#10b981' : pct > 20 ? '#f59e0b' : '#ef4444';
                  const prod = getProduct(item.product_id || '');
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-100">
                            {prod?.images?.[0]
                              ? <img src={prod.images[0]} alt="" className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><Package className="text-gray-300" style={{ width: 16, height: 16 }} /></div>}
                          </div>
                          <p className="text-sm font-medium text-gray-800 truncate max-w-[130px]">{item.product_name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono bg-gray-50 px-2 py-0.5 rounded border border-gray-100 text-gray-600">{item.sku || '—'}</span>
                      </td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-gray-800">{item.total_stock ?? 0}</td>
                      <td className="px-4 py-3.5 text-sm text-gray-500">{item.reserved_stock ?? 0}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800">{item.available_stock ?? 0}</span>
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[item.status || ''] || 'bg-gray-100 text-gray-500'}`}>
                          {(item.status || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <button onClick={() => openAdjust(item)}
                          className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1 transition-colors">
                          <Edit2 style={{ width: 12, height: 12 }} /> Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">
          {/* Stock Adjustment */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Stock Adjustment</h3>
            {adjustItem ? (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm font-semibold text-gray-800">{adjustItem.product_name}</p>
                  <p className="text-xs text-gray-400">{adjustItem.sku}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide block mb-1.5">New Stock Qty</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setAdjustQty(q => Math.max(0, q - 1))}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium">−</button>
                    <input type="number" value={adjustQty} onChange={e => setAdjustQty(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 h-9 border border-gray-200 rounded-xl text-center text-sm font-bold text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100" />
                    <button type="button" onClick={() => setAdjustQty(q => q + 1)}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium">+</button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAdjustItem(null)}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button onClick={saveAdjust} disabled={saving}
                    className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-gray-300">
                <Edit2 style={{ width: 28, height: 28 }} />
                <p className="text-xs mt-2 text-center">Click "Adjust" on any item to update stock</p>
              </div>
            )}
          </div>

          {/* Recent Movements */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Stock Movements</h3>
            <div className="space-y-3">
              {inventory.slice(0, 5).map((item, i) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${i % 2 === 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    {i % 2 === 0
                      ? <TrendingUp className="text-emerald-500" style={{ width: 13, height: 13 }} />
                      : <TrendingDown className="text-red-500" style={{ width: 13, height: 13 }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{item.product_name}</p>
                    <p className="text-[10px] text-gray-400">Today</p>
                  </div>
                  <span className={`text-xs font-semibold ${i % 2 === 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {i % 2 === 0 ? '+' : '-'}{(i + 1) * 5}
                  </span>
                </div>
              ))}
              {inventory.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No movements yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
