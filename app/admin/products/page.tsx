'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Check, X, Package, ChevronRight, Filter, Download, Star } from 'lucide-react';
import { productsApi, warehousesApi } from '@/lib/api';
import type { Product, ProductStatus, Warehouse } from '@/lib/types';

const statusBadge: Record<string, string> = {
  published: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  pending:   'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  draft:     'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  rejected:  'bg-red-50 text-red-700 ring-1 ring-red-200',
};

const tabs = ['pending', 'published', 'rejected', 'all'] as const;

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('pending');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, warehousesRes] = await Promise.all([
          productsApi.list({}),
          warehousesApi.list({}),
        ]);
        setProducts(Array.isArray(productsRes) ? productsRes : (productsRes as any).data || []);
        setWarehouses(Array.isArray(warehousesRes) ? warehousesRes : (warehousesRes as any).data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const getWarehouse = (id: string) => warehouses.find(w => w.id === id);

  const filtered = products.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.category_name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: products.length,
    pending: products.filter(p => p.status === 'pending').length,
    published: products.filter(p => p.status === 'published').length,
    rejected: products.filter(p => p.status === 'rejected').length,
  };

  const handleApprove = async (productId: string) => {
    await productsApi.update(productId, { status: 'published' });
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: 'published' as const } : p));
    setSelectedProduct(null);
  };

  const handleReject = async (productId: string) => {
    await productsApi.update(productId, { status: 'rejected' });
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: 'rejected' as const } : p));
    setSelectedProduct(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/admin" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">Product Approval</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Product Approval</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and approve products submitted by warehouses.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors bg-white">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: counts.all, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Review', value: counts.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Published', value: counts.published, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Rejected', value: counts.rejected, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center mb-2`}>
              <Package className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <div className="flex overflow-x-auto gap-1">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 capitalize ${
                  statusFilter === tab ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${statusFilter === tab ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                  {counts[tab as keyof typeof counts]}
                </span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-44 bg-gray-50 focus:bg-white transition-all"
              />
            </div>
            <button className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Warehouse</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center">
                  <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No products found</p>
                </td></tr>
              ) : filtered.map(product => {
                const wh = getWarehouse(product.warehouse_id);
                return (
                  <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                          <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.sku || 'No SKU'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{wh?.name || '—'}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{product.category_name}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-gray-900">{Number(product.final_price).toLocaleString()} Br</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadge[product.status] || 'bg-gray-100 text-gray-600'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setSelectedProduct(product)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        {product.status === 'pending' && (
                          <>
                            <button onClick={() => handleApprove(product.id)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleReject(product.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of <span className="font-semibold text-gray-700">{products.length}</span> products
          </p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">‹</button>
            <button className="w-7 h-7 rounded-lg text-xs font-semibold bg-blue-600 text-white">1</button>
            <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">›</button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative h-52 bg-gray-100">
              <img src={selectedProduct.images?.[0]} alt={selectedProduct.name} className="w-full h-full object-cover rounded-t-2xl" />
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50">
                <X className="w-4 h-4 text-gray-600" />
              </button>
              <span className={`absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadge[selectedProduct.status]}`}>{selectedProduct.status}</span>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h2>
              <p className="text-sm text-gray-500 mt-1 line-clamp-3">{selectedProduct.description}</p>
              <div className="grid grid-cols-2 gap-3 mt-5">
                {[
                  { label: 'Warehouse', value: getWarehouse(selectedProduct.warehouse_id)?.name || '—' },
                  { label: 'Category', value: selectedProduct.category_name },
                  { label: 'Price', value: `${Number(selectedProduct.final_price).toLocaleString()} Br` },
                  { label: 'SKU', value: selectedProduct.sku || 'N/A' },
                  { label: 'Brand', value: selectedProduct.brand || 'N/A' },
                  { label: 'Rating', value: `${Number(selectedProduct.rating).toFixed(1)} ⭐ (${selectedProduct.review_count})` },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
              {selectedProduct.status === 'pending' && (
                <div className="flex gap-3 mt-5">
                  <button onClick={() => handleApprove(selectedProduct.id)} className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                    <Check className="w-4 h-4" /> Approve Product
                  </button>
                  <button onClick={() => handleReject(selectedProduct.id)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                    <X className="w-4 h-4" /> Reject Product
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
