'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, AlertTriangle, Package, Plus, Minus, ChevronRight, Download, Filter, TrendingDown, TrendingUp, Boxes } from 'lucide-react';
import { inventoryApi, productsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Inventory, Product } from '@/lib/types';

const statusBadge: Record<string, string> = {
  in_stock: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  low_stock: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  out_of_stock: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

const statusLabels: Record<string, string> = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
};

const tabs = ['All', 'In Stock', 'Low Stock', 'Out of Stock'] as const;

export default function WarehouseInventory() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('All');

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

  const tabStatusMap: Record<string, string> = {
    'In Stock': 'in_stock', 'Low Stock': 'low_stock', 'Out of Stock': 'out_of_stock',
  };

  const filtered = inventory.filter(item => {
    if (activeTab !== 'All' && item.status !== tabStatusMap[activeTab]) return false;
    if (search && !item.product_name.toLowerCase().includes(search.toLowerCase()) && !item.sku.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getTabCount = (tab: typeof tabs[number]) =>
    tab === 'All' ? inventory.length : inventory.filter(i => i.status === tabStatusMap[tab]).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const inStockCount = inventory.filter(i => i.status === 'in_stock').length;
  const lowStockCount = inventory.filter(i => i.status === 'low_stock').length;
  const outOfStockCount = inventory.filter(i => i.status === 'out_of_stock').length;
  const totalUnits = inventory.reduce((sum, i) => sum + i.total_stock, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/warehouse" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Inventory</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Inventory Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and manage your product stock levels.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors bg-white">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors bg-white">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: inventory.length, color: 'text-blue-600', bg: 'bg-blue-50', icon: Boxes },
          { label: 'In Stock', value: inStockCount, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Package },
          { label: 'Low Stock', value: lowStockCount, color: 'text-amber-600', bg: 'bg-amber-50', icon: TrendingDown },
          { label: 'Out of Stock', value: outOfStockCount, color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Alert Banner */}
      {outOfStockCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">{outOfStockCount} products are out of stock!</p>
            <p className="text-xs text-red-600">Restock these items to avoid losing sales.</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs + Search */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="flex overflow-x-auto gap-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeTab === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {getTabCount(tab)}
                </span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44 bg-gray-50 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">SKU</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Reserved</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Available</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No inventory items found</p>
                  </td>
                </tr>
              ) : (
                filtered.map(item => {
                  const product = getProduct(item.product_id);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                            {product?.images?.[0] && <img src={product.images[0]} alt={item.product_name} className="w-full h-full object-cover" />}
                          </div>
                          <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500 font-mono">{item.sku}</td>
                      <td className="px-5 py-4 text-center text-sm font-semibold text-gray-900">{item.total_stock}</td>
                      <td className="px-5 py-4 text-center text-sm text-gray-500">{item.reserved_stock}</td>
                      <td className="px-5 py-4 text-center text-sm font-semibold text-gray-900">{item.available_stock}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge[item.status]}`}>
                          {statusLabels[item.status]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStockUpdate(item.id, -1)}
                            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-semibold text-gray-900 w-6 text-center">{item.total_stock}</span>
                          <button
                            onClick={() => handleStockUpdate(item.id, 1)}
                            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of <span className="font-semibold text-gray-700">{inventory.length}</span> items
          </p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600 transition-colors">‹</button>
            <button className="w-7 h-7 rounded-lg text-xs font-semibold bg-blue-600 text-white">1</button>
            <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600 transition-colors">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
