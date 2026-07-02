'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Check, X, Package, Clock } from 'lucide-react';
import { productsApi, warehousesApi } from '@/lib/api';
import type { Product, ProductStatus, Warehouse } from '@/lib/mock-db';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('pending');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, warehousesRes] = await Promise.all([
          productsApi.list({}),
          warehousesApi.list({}),
        ]);
        setProducts(productsRes.data);
        setWarehouses(warehousesRes.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getWarehouse = (warehouseId: string) => warehouses.find(w => w.id === warehouseId);

  let filteredProducts = products;
  if (statusFilter !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.status === statusFilter);
  }
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const statusCounts = {
    all: products.length,
    pending: products.filter(p => p.status === 'pending').length,
    published: products.filter(p => p.status === 'published').length,
    draft: products.filter(p => p.status === 'draft').length,
    rejected: products.filter(p => p.status === 'rejected').length,
  };

  const handleApprove = async (productId: string) => {
    try {
      await productsApi.update(productId, { status: 'published' });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: 'published' as const } : p));
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to approve product:', error);
    }
  };

  const handleReject = async (productId: string) => {
    try {
      await productsApi.update(productId, { status: 'rejected' });
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: 'rejected' as const } : p));
      setSelectedProduct(null);
    } catch (error) {
      console.error('Failed to reject product:', error);
    }
  };

  const selectedProductData = products.find(p => p.id === selectedProduct);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <p className="text-gray-500">Review and approve products submitted by warehouses</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['pending', 'published', 'rejected', 'all'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1 text-xs opacity-70">({statusCounts[status]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => {
          const warehouse = getWarehouse(product.warehouse_id);
          return (
            <div key={product.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative aspect-video">
                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                {product.status === 'pending' && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-blue-600 font-medium mb-1">{product.category_name}</p>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-2">by {warehouse?.name || 'Unknown'}</p>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-900">${product.final_price.toFixed(2)}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    product.status === 'published' ? 'bg-green-100 text-green-700' :
                    product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    product.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {product.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(product.id)}
                    className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  {product.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(product.id)}
                        className="py-2 px-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(product.id)}
                        className="py-2 px-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProductData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-video">
              <img src={selectedProductData.images[0]} alt={selectedProductData.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                selectedProductData.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                selectedProductData.status === 'published' ? 'bg-green-100 text-green-700' :
                'bg-red-100 text-red-700'
              }`}>
                {selectedProductData.status}
              </span>
              <h2 className="text-xl font-bold text-gray-900">{selectedProductData.name}</h2>
              <p className="text-gray-600 mt-2">{selectedProductData.description}</p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Warehouse</p>
                  <p className="font-medium text-gray-900">{getWarehouse(selectedProductData.warehouse_id)?.name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Category</p>
                  <p className="font-medium text-gray-900">{selectedProductData.category_name}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Price</p>
                  <p className="font-medium text-gray-900">${selectedProductData.final_price.toFixed(2)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">SKU</p>
                  <p className="font-medium text-gray-900">{selectedProductData.sku || 'N/A'}</p>
                </div>
              </div>

              {selectedProductData.status === 'pending' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleApprove(selectedProductData.id)}
                    className="flex-1 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Approve Product
                  </button>
                  <button
                    onClick={() => handleReject(selectedProductData.id)}
                    className="flex-1 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Reject Product
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
