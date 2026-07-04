'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Search, AlertTriangle, Package, Plus, Minus } from 'lucide-react';
import { inventoryApi, productsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Inventory, Product } from '@/lib/types';

export default function WarehouseInventory() {
  const { user } = useAuth();
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_stock' | 'low_stock' | 'out_of_stock'>('all');

  useEffect(() => {
    async function fetchData() {
      const warehouseId = user?.warehouse_id;
      if (!warehouseId) return;
      try {
        const [inventoryRes, productsRes] = await Promise.all([
          inventoryApi.list({ warehouse_id: warehouseId }),
          productsApi.list({ warehouse_id: warehouseId }),
        ]);
        const inventoryData = Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes as { data?: Inventory[] }).data || [];
        const productsData = Array.isArray(productsRes) ? productsRes : (productsRes as { data?: Product[] }).data || [];
        setInventory(inventoryData);
        setProducts(productsData);
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

    const updatedItem = {
      ...item,
      total_stock: newTotal,
      available_stock: available,
      status,
      last_updated: new Date().toISOString(),
    };

    setInventory(prev => prev.map(i => i.id === itemId ? updatedItem : i));
    await inventoryApi.update(itemId, updatedItem);
  };

  let filteredInventory = inventory;
  if (statusFilter !== 'all') {
    filteredInventory = filteredInventory.filter(i => i.status === statusFilter);
  }
  if (searchQuery) {
    filteredInventory = filteredInventory.filter(i =>
      i.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const statusCounts = {
    all: inventory.length,
    in_stock: inventory.filter(i => i.status === 'in_stock').length,
    low_stock: inventory.filter(i => i.status === 'low_stock').length,
    out_of_stock: inventory.filter(i => i.status === 'out_of_stock').length,
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-500">Track and manage your product stock levels</p>
      </div>

      {/* Alerts */}
      {statusCounts.out_of_stock > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold">{statusCounts.out_of_stock} products are out of stock!</span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'in_stock', 'low_stock', 'out_of_stock'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'in_stock' ? 'In Stock' : status === 'low_stock' ? 'Low Stock' : status === 'out_of_stock' ? 'Out of Stock' : 'All'}
              <span className="ml-1 text-xs opacity-70">({statusCounts[status]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total Stock</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Reserved</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-gray-500 uppercase">Available</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredInventory.map((item) => {
              const product = getProduct(item.product_id);
              return (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product?.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={item.product_name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <p className="font-medium text-gray-900">{item.product_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.sku}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-medium text-gray-900">{item.total_stock}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">{item.reserved_stock}</td>
                  <td className="px-4 py-3 text-center font-medium text-gray-900">{item.available_stock}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'in_stock' ? 'bg-green-100 text-green-700' :
                      item.status === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status === 'in_stock' ? 'In Stock' : item.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStockUpdate(item.id, -1)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStockUpdate(item.id, 1)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-green-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredInventory.length === 0 && (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No inventory items found</p>
          </div>
        )}
      </div>
    </div>
  );
}
