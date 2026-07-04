'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search, Plus, Eye, Edit2, Trash2, Filter, Download,
  Package, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { productsApi, inventoryApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Product, Inventory } from '@/lib/types';

const TABS = ['All', 'Published', 'Pending', 'Draft'] as const;
type Tab = typeof TABS[number];

const STATUS_BADGE: Record<string, string> = {
  published: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  approved: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  pending: 'bg-amber-50 text-amber-700 border border-amber-100',
  draft: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-50 text-red-700 border border-red-100',
  archived: 'bg-gray-100 text-gray-500',
};

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('All');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetch() {
      const wid = user?.warehouse_id;
      if (!wid) return;
      try {
        const [pr, ir] = await Promise.all([
          productsApi.list({ warehouse_id: wid }),
          inventoryApi.list({ warehouse_id: wid }),
        ]);
        setProducts(Array.isArray(pr) ? pr : (pr as any).data || []);
        setInventory(Array.isArray(ir) ? ir : (ir as any).data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    if (user?.warehouse_id) fetch();
  }, [user?.warehouse_id]);

  const getStock = (productId: string) => {
    const inv = inventory.find(i => i.product_id === productId);
    return inv?.total_stock ?? 0;
  };

  const tabFilter = (p: Product) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Published') return p.status === 'published' || p.status === 'approved';
    if (activeTab === 'Pending') return p.status === 'pending';
    if (activeTab === 'Draft') return p.status === 'draft';
    return true;
  };

  const filtered = products.filter(p =>
    tabFilter(p) &&
    (search === '' || p.name?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase()))
  );

  const tabCounts: Record<Tab, number> = {
    All: products.length,
    Published: products.filter(p => p.status === 'published' || p.status === 'approved').length,
    Pending: products.filter(p => p.status === 'pending').length,
    Draft: products.filter(p => p.status === 'draft').length,
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const toggleAll = () => {
    selected.size === filtered.length ? setSelected(new Set()) : setSelected(new Set(filtered.map(p => p.id)));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Product Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and track your product catalog</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Download style={{ width: 14, height: 14 }} />
            Export
          </button>
          <Link href="/warehouse/products/add">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              <Plus style={{ width: 15, height: 15 }} />
              Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center border-b border-gray-100 px-5 gap-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === tab ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'
              }`}>
                {tabCounts[tab]}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 13, height: 13 }} />
            <input
              type="text"
              placeholder="Search by name or SKU…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 h-9 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-3 h-9 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter style={{ width: 13, height: 13 }} /> Category
          </button>
          <button className="flex items-center gap-2 px-3 h-9 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter style={{ width: 13, height: 13 }} /> Status
          </button>
          {selected.size > 0 && (
            <button className="flex items-center gap-2 px-3 h-9 rounded-xl bg-red-50 border border-red-100 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors ml-auto">
              <Trash2 style={{ width: 13, height: 13 }} /> Delete ({selected.size})
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70">
                <th className="w-10 px-5 py-3">
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                </th>
                {['Product', 'SKU', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-gray-300">
                    <Package style={{ width: 40, height: 40 }} />
                    <p className="text-sm">No products found</p>
                    <Link href="/warehouse/products/add">
                      <button className="mt-1 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                        + Add Your First Product
                      </button>
                    </Link>
                  </div>
                </td></tr>
              ) : filtered.map(product => {
                const stock = getStock(product.id);
                return (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <input type="checkbox" checked={selected.has(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                          {product.images?.[0]
                            ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Package className="text-gray-300" style={{ width: 18, height: 18 }} /></div>
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">{product.name}</p>
                          {product.brand && <p className="text-[11px] text-gray-400">{product.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs font-mono bg-gray-50 px-2 py-1 rounded-lg text-gray-600 border border-gray-100">{product.sku || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-500">{product.category?.name || '—'}</td>
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{Number(product.final_price || 0).toFixed(2)} Br</p>
                        {product.original_price && product.original_price > product.final_price && (
                          <p className="text-[11px] text-gray-400 line-through">{Number(product.original_price).toFixed(2)} Br</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold ${stock === 0 ? 'text-red-600' : stock < 10 ? 'text-amber-600' : 'text-gray-700'}`}>
                        {stock}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[product.status || ''] || 'bg-gray-100 text-gray-500'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link href={`/products/${product.id}`}>
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors" title="View">
                            <Eye style={{ width: 15, height: 15 }} />
                          </button>
                        </Link>
                        <Link href={`/warehouse/products/${product.id}/edit`}>
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Edit">
                            <Edit2 style={{ width: 15, height: 15 }} />
                          </button>
                        </Link>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                          <Trash2 style={{ width: 15, height: 15 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50">
          <p className="text-xs text-gray-500">Showing {filtered.length} of {products.length} products</p>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-40" disabled>
              <ChevronLeft style={{ width: 13, height: 13 }} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
              <ChevronRight style={{ width: 13, height: 13 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
