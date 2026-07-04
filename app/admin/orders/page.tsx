'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { ordersApi, warehousesApi } from '@/lib/api';
import type { Order, OrderStatus, Warehouse } from '@/lib/types';

const statusLabels: Record<string, string> = {
  all: 'All',
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-violet-100 text-violet-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, warehousesRes] = await Promise.all([
          ordersApi.list({}),
          warehousesApi.list({}),
        ]);
        const ordersData = Array.isArray(ordersRes) ? ordersRes : (ordersRes as { data?: Order[] }).data || [];
        const warehousesData = Array.isArray(warehousesRes) ? warehousesRes : (warehousesRes as { data?: Warehouse[] }).data || [];
        setOrders(ordersData);
        setWarehouses(warehousesData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getWarehouse = (warehouseId: string) => warehouses.find(w => w.id === warehouseId);

  let filteredOrders = orders;
  if (statusFilter !== 'all') {
    filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
  }
  if (searchQuery) {
    filteredOrders = filteredOrders.filter(o =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  filteredOrders = [...filteredOrders].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
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
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-500">View and manage all orders across the platform</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-6 gap-2">
        {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`p-3 rounded-lg text-center transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-100 text-gray-700 hover:border-blue-300'
            }`}
          >
            <p className="text-lg font-bold">{statusCounts[status]}</p>
            <p className="text-xs">{statusLabels[status] || 'All'}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Warehouse</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.map((order) => {
              const warehouse = getWarehouse(order.warehouse_id);
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-blue-600">#{order.id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{order.customer_name}</p>
                      <p className="text-xs text-gray-500">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{warehouse?.name || 'Unknown'}</td>
                  <td className="px-4 py-3">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <img
                          key={idx}
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-full border-2 border-white object-cover"
                        />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">{order.total.toLocaleString()} Br</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredOrders.length === 0 && (
          <div className="p-12 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
