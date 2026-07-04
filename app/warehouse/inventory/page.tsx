'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Search, Package, AlertTriangle, Boxes, TrendingDown, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { inventoryApi, productsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Inventory, Product } from '@/lib/types';

const statusBadge: Record<string, string> = {
  in_stock: 'bg-emerald-100 text-emerald-700',
  low_stock: 'bg-amber-100 text-amber-700',
  out_of_stock: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
};

const tabs = ['All Inventory', 'Low Stock', 'Out of Stock'] as const;

export default function WarehouseInventory() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('All Inventory');
  const [adjustingId, setAdjustingId] = useState<string | null>(null);
  const [adjustQty, setAdjustQty] = useState('');

  useEffect(() => {
    async function fetchData() {
      const warehouseId = user?.warehouse_id;
      if (!warehouseId) return;
      try {
        const [inventoryRes, productsRes] = await Promise.all([
          inventoryApi.list({ warehouse_id: warehouseId }),
          productsApi.list({ warehouse_id: warehouseId }),
        ]);
        setInventory(Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes as any).data || []);
        setProducts(Array.isArray(productsRes) ? productsRes : (productsRes as any).data || []);
      } catch (error) {
        console.error('Failed to fetch inventory:', error);
      } finally {
        setLoading(false);
      }
    }
    if (user?.warehouse_id) fetchData();
  }, [user?.warehouse_id]);

  const getProduct = (productId: string) => products.find(p => p.id === productId);

  const handleAdjust = async (item: Inventory, delta: number) => {
    const newTotal = Math.max(0, item.total_stock + delta);
    const available = newTotal - item.reserved_stock;
    let status: Inventory['status'] = 'in_stock';
    if (available === 0) status = 'out_of_stock';
    else if (available <= item.low_stock_threshold) status = 'low_stock';
    const updated = { ...item, total_stock: newTotal, available_stock: available, status };
    setInventory(prev => prev.map(i => i.id === item.id ? updated : i));
    await inventoryApi.update(item.id, updated);
  };

  const tabMap: Record<string, string[]> = {
    'Low Stock': ['low_stock'],
    'Out of Stock': ['out_of_stock'],
  };

  const filtered = inventory.filter(item => {
    if (activeTab !== 'All Inventory' && !tabMap[activeTab]?.includes(item.status)) return false;
    if (search && !item.product_name.toLowerCase().includes(search.toLowerCase()) && !item.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const lowStockCount = inventory.filter(i => i.status === 'low_stock').length;
  const outOfStockCount = inventory.filter(i => i.status === 'out_of_stock').length;
  const totalUnits = inventory.reduce((s, i) => s + i.total_stock, 0);

  const adjustingItem = inventory.find(i => i.id === adjustingId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track stock levels, manage inventory and view stock movement history.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-purple-600/20">
          <Plus className="w-4 h-4" />
          Stock Adjustment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: inventory.length, sub: '+6.2% vs last week', color: 'text-blue-600', bg: 'bg-blue-50', icon: Boxes },
          { label: 'Total Stock', value: totalUnits.toLocaleString(), sub: 'All warehouse stock', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Package },
          { label: 'Low Stock Items', value: lowStockCount, sub: 'Require attention', color: 'text-amber-600', bg: 'bg-amber-50', icon: TrendingDown },
          { label: 'Out of Stock Items', value: outOfStockCount, sub: 'Need restocking', color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tabs + Search */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 gap-3 flex-wrap">
            <div className="flex gap-1">
              {tabs.map((tab, idx) => {
                const counts: Record<string, number> = { 'All Inventory': inventory.length, 'Low Stock': lowStockCount, 'Out of Stock': outOfStockCount };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${activeTab === tab ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {tab} {idx > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>{counts[tab]}</span>}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 15, height: 15 }} />
                <input
                  type="text"
                  placeholder="Search by product name or SKU..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 w-52 bg-gray-50 focus:bg-white transition-all"
                />
              </div>
              <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:border-purple-400">
                <option>All Categories</option>
              </select>
              <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:border-purple-400">
                <option>Stock Status</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/60 border-b border-gray-100">
                  {['Product', 'SKU', 'Category', 'Total Stock', 'Reserved', 'Available', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No inventory items found</p>
                    </td>
                  </tr>
                ) : filtered.map(item => {
                  const product = getProduct(item.product_id);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                            {product?.images?.[0] && <img src={product.images[0]} alt={item.product_name} className="w-full h-full object-cover" />}
                          </div>
                          <p className="text-sm font-medium text-gray-900 max-w-[120px] truncate">{item.product_name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 font-mono">{item.sku}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{product?.category_name || '—'}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">{item.total_stock}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{item.reserved_stock}</td>
                      <td className="px-4 py-4 text-sm font-semibold text-gray-900">{item.available_stock}</td>
                      <td className="px-4 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[item.status]}`}>
                          {statusLabels[item.status]}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setAdjustingId(adjustingId === item.id ? null : item.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                        >
                          Adjust
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of <span className="font-semibold text-gray-700">{inventory.length}</span> items
            </p>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">‹</button>
              <button className="w-8 h-8 rounded-lg text-xs font-semibold bg-purple-600 text-white">1</button>
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">›</button>
            </div>
          </div>
        </div>

        {/* Right Panel - Stock Adjustment */}
        <div className="w-64 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-2">Stock Adjustment</h3>
            <p className="text-xs text-gray-500 mb-4">Update your stock quantities. Quickly adjust inventory levels for any product.</p>

            {adjustingItem ? (
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-semibold text-gray-800 truncate">{adjustingItem.product_name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Current stock: <span className="font-bold text-gray-800">{adjustingItem.total_stock}</span></p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleAdjust(adjustingItem, -1)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">−</button>
                  <span className="w-10 text-center text-sm font-bold text-gray-900">{adjustingItem.total_stock}</span>
                  <button onClick={() => handleAdjust(adjustingItem, 1)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm font-bold text-emerald-500 hover:bg-emerald-50 transition-colors">+</button>
                </div>
                <button
                  onClick={() => setAdjustingId(null)}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adjust Stock
                </button>
              </div>
            ) : (
              <div className="py-6 text-center">
                <Boxes className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Click "Adjust" on a product to manage stock</p>
              </div>
            )}
          </div>

          {/* Recent Stock Movements */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Recent Stock Movements</h3>
            <div className="space-y-3">
              {inventory.slice(0, 4).map((item, i) => (
                <div key={item.id} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                    {products.find(p => p.id === item.product_id)?.images?.[0] && (
                      <img src={products.find(p => p.id === item.product_id)!.images[0]} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{item.product_name}</p>
                    <p className="text-[10px] text-gray-400">Updated recently</p>
                  </div>
                  <span className={`text-[10px] font-bold ${i % 2 === 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {i % 2 === 0 ? '+10' : '-5'} units
                  </span>
                </div>
              ))}
            </div>
            {inventory.length > 4 && (
              <Link href="/warehouse/inventory">
                <button className="w-full mt-3 text-xs text-purple-600 font-medium hover:text-purple-700 transition-colors text-center">
                  View All Movements
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
