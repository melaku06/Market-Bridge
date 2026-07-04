'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Edit, Trash2, Package, ChevronRight, Download, Filter, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useProductsStore } from '@/stores/products/products-store';
import { useInventoryStore } from '@/stores/inventory/inventory-store';

const statusBadge: Record<string, string> = {
  published: 'bg-emerald-100 text-emerald-700',
  approved: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  draft: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-700',
  archived: 'bg-gray-100 text-gray-500',
};

const stockBadge: Record<string, string> = {
  in_stock: 'bg-emerald-100 text-emerald-700',
  low_stock: 'bg-amber-100 text-amber-700',
  out_of_stock: 'bg-red-100 text-red-700',
};

const stockLabel: Record<string, string> = {
  in_stock: 'Active',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
};

const tabs = ['All', 'Published', 'Pending', 'Draft'] as const;

export default function WarehouseProducts() {
  const { user } = useAuth();
  const { products, fetchProducts, isLoading: productsLoading } = useProductsStore();
  const { inventory, fetchInventory, isLoading: inventoryLoading } = useInventoryStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('All');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const warehouseId = user?.warehouse_id;
    if (!warehouseId) return;
    fetchProducts({ warehouse_id: warehouseId });
    fetchInventory({ warehouse_id: warehouseId });
  }, [user?.warehouse_id, fetchProducts, fetchInventory]);

  const loading = productsLoading || inventoryLoading;

  const getInv = (productId: string) => inventory.find(i => i.product_id === productId);

  const filtered = products.filter(p => {
    if (activeTab !== 'All' && p.status !== activeTab.toLowerCase()) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.sku?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getTabCount = (tab: typeof tabs[number]) =>
    tab === 'All' ? products.length : products.filter(p => p.status === tab.toLowerCase()).length;

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p.id)));
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all your products, edit details, and track performance.</p>
        </div>
        <Link href="/warehouse/products/add">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm shadow-purple-600/20 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 15, height: 15 }} />
              <input
                type="text"
                placeholder="Search by name, SKU, or barcode..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-gray-50 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 bg-white">
                <option>All Categories</option>
              </select>
              <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 bg-white">
                <option>All Status</option>
                <option>Published</option>
                <option>Pending</option>
                <option>Draft</option>
              </select>
              <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 bg-white">
                <option>All Tags</option>
              </select>
              <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Bulk actions + tabs */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none">
                <option>Bulk Actions</option>
                <option>Delete Selected</option>
              </select>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-medium transition-colors">
                Apply
              </button>
            </div>
            <div className="flex gap-0.5">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${activeTab === tab ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {tab}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                    {getTabCount(tab)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100">
                <th className="px-5 py-3.5 text-left w-10">
                  <input type="checkbox" onChange={toggleAll} checked={selected.size === filtered.length && filtered.length > 0} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No products found</p>
                    <Link href="/warehouse/products/add" className="text-purple-600 text-sm hover:underline mt-1 inline-block">Add your first product</Link>
                  </td>
                </tr>
              ) : filtered.map(product => {
                const inv = getInv(product.id);
                return (
                  <tr key={product.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-5 py-4">
                      <input type="checkbox" checked={selected.has(product.id)} onChange={() => toggleOne(product.id)} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          <img src={product.images?.[0] || 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=100'} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-sm font-semibold text-gray-900 max-w-[150px] truncate">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 font-mono">{product.sku || '—'}</td>
                    <td className="px-4 py-4 text-sm text-gray-600">{product.category_name}</td>
                    <td className="px-4 py-4 text-sm font-semibold text-gray-900">${product.final_price.toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${stockBadge[inv?.status || 'out_of_stock']}`}>
                        {stockLabel[inv?.status || 'out_of_stock']}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadge[product.status] || 'bg-gray-100 text-gray-600'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/products/${product.id}`}>
                          <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-1.5 rounded-lg hover:bg-purple-50 text-gray-400 hover:text-purple-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">1 to {filtered.length}</span> of <span className="font-semibold text-gray-700">{products.length}</span> products
          </p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600 transition-colors">‹</button>
            {[1, 2, 3, 4, 5].map(p => (
              <button key={p} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${p === 1 ? 'bg-purple-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>{p}</button>
            ))}
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600 transition-colors">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
