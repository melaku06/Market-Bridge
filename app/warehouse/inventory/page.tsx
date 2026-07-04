'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, AlertTriangle, Package, Plus, Minus, ChevronRight, Filter, Boxes, ArrowUp, ArrowDown } from 'lucide-react';
import { inventoryApi, productsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Inventory, Product } from '@/lib/types';

const statusBadge: Record<string, string> = {
  in_stock: 'text-emerald-700 font-semibold',
  low_stock: 'text-amber-600 font-semibold',
  out_of_stock: 'text-red-600 font-semibold',
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
  const [adjustProduct, setAdjustProduct] = useState<Inventory | null>(null);
  const [adjustQty, setAdjustQty] = useState(0);

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

  const handleStockUpdate = async (itemId: string, adjustment: number) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    const newTotal = Math.max(0, item.total_stock + adjustment);
    const available = newTotal - item.reserved_stock;
    let status: 'in_stock' | 'low_stock' | 'out_of_stock' = 'in_stock';
    if (available === 0) status = 'out_of_stock';
    else if (available <= item.low_stock_threshold) status = 'low_stock';
    const updatedItem = { ...item, total_stock: newTotal, available_stock: available, status, last_updated: new Date().toISOString() };
    setInventory(prev => prev.map(i => i.id === itemId ? updatedItem : i));
    await inventoryApi.update(itemId, updatedItem);
  };

  const tabMap: Record<string, string> = {
    'Low Stock': 'low_stock',
    'Out of Stock': 'out_of_stock',
  };

  const filtered = inventory.filter(item => {
    if (activeTab !== 'All Inventory' && item.status !== tabMap[activeTab]) return false;
    if (search && !item.product_name.toLowerCase().includes(search.toLowerCase()) && !item.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const lowStockCount = inventory.filter(i => i.status === 'low_stock').length;
  const outOfStockCount = inventory.filter(i => i.status === 'out_of_stock').length;
  const totalUnits = inventory.reduce((sum, i) => sum + i.total_stock, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/warehouse" className="hover:text-blue-600">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Inventory</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track stock levels, manage inventory and view stock movement history.</p>
        </div>
        <button
          onClick={() => setAdjustProduct(inventory[0] || null)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Stock Adjustment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: inventory.length, sub: '+6.2% vs last week', icon: Boxes, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Total Stock', value: totalUnits.toLocaleString(), sub: 'All warehouse stock', icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Low Stock Items', value: lowStockCount, sub: 'Require attention', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Out of Stock Items', value: outOfStockCount, sub: 'Need restocking', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs font-semibold text-gray-700 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Main content */}
      <div className="flex gap-5">
        {/* Table */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {tabs.map(tab => {
              const count = tab === 'All Inventory' ? inventory.length : tab === 'Low Stock' ? lowStockCount : outOfStockCount;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {tab !== 'All Inventory' && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search + Filters */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/30">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product name or SKU..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:outline-none bg-white"
              />
            </div>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none">
              <option>All Categories</option>
            </select>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-600 focus:outline-none">
              <option>Stock Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Stock</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reserved</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Available</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
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
                ) : (
                  filtered.map(item => {
                    const product = getProduct(item.product_id);
                    return (
                      <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                              {product?.images?.[0] && <img src={product.images[0]} alt={item.product_name} className="w-full h-full object-cover" />}
                            </div>
                            <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-gray-500 font-mono">{item.sku}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-500">{product?.category_name || '—'}</td>
                        <td className="px-5 py-3.5 text-center text-sm font-semibold text-gray-900">{item.total_stock}</td>
                        <td className="px-5 py-3.5 text-center text-sm text-gray-500">{item.reserved_stock}</td>
                        <td className="px-5 py-3.5 text-center text-sm font-semibold text-gray-900">{item.available_stock}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs ${statusBadge[item.status]}`}>
                            {statusLabels[item.status]}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => { setAdjustProduct(item); setAdjustQty(0); }}
                            className="text-xs text-blue-600 font-semibold border border-blue-200 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Adjust
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of <span className="font-semibold text-gray-700">{inventory.length}</span> items
            </p>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">‹</button>
              <button className="w-7 h-7 rounded-lg text-xs font-semibold bg-blue-600 text-white">1</button>
              <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">›</button>
            </div>
          </div>
        </div>

        {/* Stock Adjustment Panel */}
        <div className="w-64 flex-shrink-0 space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-1">Stock Adjustment</h3>
            <p className="text-xs text-gray-500 mb-4">Update your stock quantities. Quickly adjust inventory levels for any product.</p>

            {adjustProduct ? (
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Product</p>
                  <p className="text-sm font-semibold text-gray-800">{adjustProduct.product_name}</p>
                  <p className="text-xs text-gray-400">Current stock: {adjustProduct.total_stock}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Adjustment Qty</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAdjustQty(q => q - 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      value={adjustQty}
                      onChange={e => setAdjustQty(Number(e.target.value))}
                      className="flex-1 text-center border border-gray-200 rounded-lg py-1.5 text-sm font-semibold focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={() => setAdjustQty(q => q + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => { if (adjustQty !== 0 && adjustProduct) { handleStockUpdate(adjustProduct.id, adjustQty); setAdjustQty(0); } }}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  + Adjust Stock
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">Select a product to adjust stock</p>
            )}
          </div>

          {/* Recent Stock Movements */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-sm">Recent Stock Movements</h3>
            </div>
            <div className="space-y-3">
              {inventory.slice(0, 4).map((item, i) => (
                <div key={item.id} className="flex items-start gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${i % 2 === 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                    {i % 2 === 0 ? <ArrowUp className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowDown className="w-3.5 h-3.5 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{item.product_name}</p>
                    <p className="text-[11px] text-gray-400">
                      {new Date(item.last_updated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold ${i % 2 === 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {i % 2 === 0 ? '+' : '-'}{Math.abs((i + 1) * 5)} units
                  </span>
                </div>
              ))}
            </div>
            {inventory.length > 4 && (
              <button className="w-full mt-3 text-xs text-blue-600 hover:underline font-medium">View All Movements</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
