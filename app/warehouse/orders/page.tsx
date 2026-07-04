'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Search, Eye, Truck, XCircle, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ordersApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Order, OrderStatus } from '@/lib/types';

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
  pending: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  confirmed: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100',
  processing: 'bg-purple-50 text-purple-700 ring-1 ring-purple-100',
  shipped: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100',
  delivered: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  cancelled: 'bg-red-50 text-red-700 ring-1 ring-red-100',
};

export default function WarehouseOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    async function fetchOrders() {
      const warehouseId = user?.warehouse_id;
      if (!warehouseId) return;
      try {
        const res = await ordersApi.list({ warehouse_id: warehouseId });
        const ordersData = Array.isArray(res) ? res : (res as { data?: Order[] }).data || [];
        setOrders(ordersData);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    }
    if (user?.warehouse_id) fetchOrders();
  }, [user?.warehouse_id]);

  let filteredOrders = orders;
  if (statusFilter !== 'all') {
    filteredOrders = filteredOrders.filter(o => o.status === statusFilter);
  }
  if (searchQuery) {
    filteredOrders = filteredOrders.filter(o =>
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-0.5">Manage customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'processing', 'shipped', 'delivered'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {statusLabels[status]}
              <span className={`ml-1.5 text-xs ${statusFilter === status ? 'text-indigo-200' : 'text-gray-400'}`}>
                ({statusCounts[status]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[order.status]}`}>
                    {statusLabels[order.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{order.customer_name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{order.total.toLocaleString()} Br</p>
                <p className="text-xs text-gray-500 mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex gap-4 overflow-x-auto pb-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover ring-1 ring-gray-100" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <Link
                href={`/warehouse/orders/${order.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Details
                <ChevronRight className="w-4 h-4" />
              </Link>
              {order.status === 'pending' && (
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-medium hover:bg-emerald-100 transition-colors">
                  <Clock className="w-4 h-4" />
                  Process Order
                </button>
              )}
              {order.status === 'processing' && (
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition-colors">
                  <Truck className="w-4 h-4" />
                  Ship Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">No orders found</p>
          <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filter</p>
        </div>
      )}
    </div>
  );
}
