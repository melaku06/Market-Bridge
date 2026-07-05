'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Truck, Clock, Package, Download, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useAuth } from '@/components/auth/auth-provider';
import { useOrdersStore } from '@/stores/orders/orders-store';
import type { OrderStatus } from '@/lib/types';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-orange-100 text-orange-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

const tabs = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const;
const tabLabels: Record<string, string> = {
  all: 'All Orders', pending: 'New', processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
};

export default function WarehouseOrders() {
  const { user } = useAuth();
  const { orders, fetchOrders, isLoading: loading } = useOrdersStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    const warehouseId = user?.warehouse_id;
    if (!warehouseId) return;
    fetchOrders({ warehouse_id: warehouseId });
  }, [user?.warehouse_id, fetchOrders]);

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customer_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts: Record<string, number> = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
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
      <div>
        <h1 className="text-xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage and fulfill customer orders</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab as any)}
              className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                statusFilter === tab
                  ? 'border-purple-600 text-purple-600 bg-purple-50/50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
              }`}
            >
              {tabLabels[tab]}
              {counts[tab] > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${statusFilter === tab ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                  {counts[tab]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filter Row */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 15, height: 15 }} />
            <input
              type="text"
              placeholder="Search by Order ID, Customer or Product..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:border-purple-400">
            <option>All Status</option>
          </select>
          <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:border-purple-400">
            <option>All Payment</option>
          </select>
          <select className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white focus:outline-none focus:border-purple-400">
            <option>This Month</option>
            <option>This Week</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors bg-white">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/60 border-b border-gray-100">
                {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No orders found</p>
                  </td>
                </tr>
              ) : filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">#{order.id.slice(-6).toUpperCase()}</span>
                      {order.status === 'pending' && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-md">New</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">{order.customer_name}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[140px]">{order.customer_email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex -space-x-2">
                      {(order.items || []).slice(0, 3).map((item: any, i: number) => (
                        <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white bg-gray-50 flex-shrink-0 shadow-sm">
                          <img src={item.product_image || '/placeholder.jpg'} alt={item.product_name || 'Product'} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {(order.items?.length || 0) > 3 && (
                        <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 shadow-sm">
                          +{(order.items?.length || 0) - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-gray-900">${order.total.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      order.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                      order.payment_status === 'cod' ? 'bg-gray-100 text-gray-600' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.payment_status === 'paid' ? 'Paid' : order.payment_status === 'cod' ? 'COD' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/warehouse/orders/${order.id}`}>
                        <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      {order.status === 'pending' && (
                        <button className="text-xs text-emerald-600 font-semibold border border-emerald-200 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Process
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button className="text-xs text-purple-600 font-semibold border border-purple-200 hover:bg-purple-50 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1">
                          <Truck className="w-3 h-3" /> Ship
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">1 to {filtered.length}</span> of <span className="font-semibold text-gray-700">{orders.length}</span> orders
          </p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">‹</button>
              {[1, 2, 3].map(p => (
                <button key={p} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${p === 1 ? 'bg-purple-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>{p}</button>
              ))}
              <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-xs hover:bg-gray-100 text-gray-600">›</button>
            </div>
            <select className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 bg-white focus:outline-none">
              <option>10 / page</option>
              <option>25 / page</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
