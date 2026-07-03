'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Eye, Edit, Trash2, Package } from 'lucide-react';
import { productsApi, inventoryApi } from '@/lib/api';
import type { Product, ProductStatus, Inventory } from '@/lib/mock-db';

export default function WarehouseProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'all'>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const warehouseId = 'wh-001';
        const [productsRes, inventoryRes] = await Promise.all([
          productsApi.list({ warehouse_id: warehouseId }),
          inventoryApi.list({ warehouse_id: warehouseId }),
        ]);
        const productsData = Array.isArray(productsRes) ? productsRes : (productsRes as { data?: Product[] }).data || [];
        const inventoryData = Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes as { data?: Inventory[] }).data || [];
        setProducts(productsData);
        setInventory(inventoryData);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  let filteredProducts = products;
  if (statusFilter !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.status === statusFilter);
  }
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const statusCounts = {
    all: products.length,
    published: products.filter(p => p.status === 'published').length,
    pending: products.filter(p => p.status === 'pending').length,
    draft: products.filter(p => p.status === 'draft').length,
  };

  const getInventory = (productId: string) => inventory.find(i => i.product_id === productId);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500">Manage your product catalog</p>
        </div>
        <Link
          href="/warehouse/products/add"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
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
          {(['all', 'published', 'pending', 'draft'] as const).map((status) => (
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

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => {
              const inv = getInventory(product.id);
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{product.category_name}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{product.final_price.toLocaleString()} Br</p>
                      {product.discount_percent > 0 && (
                        <p className="text-xs text-gray-400 line-through">{product.original_price.toLocaleString()} Br</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inv?.status === 'in_stock' ? 'bg-green-100 text-green-700' :
                      inv?.status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {inv?.available_stock ?? 0} units
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.status === 'published' ? 'bg-green-100 text-green-700' :
                      product.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      product.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/warehouse/products/${product.id}/edit`}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}
