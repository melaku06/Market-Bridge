'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Package, ChevronRight, ArrowRight, Download } from 'lucide-react';
import { useOrdersStore } from '@/stores';

const statusColor: Record<string, string> = {
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  shipped: 'bg-blue-50 text-blue-700 ring-blue-200',
  processing: 'bg-orange-50 text-orange-700 ring-orange-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
  confirmed: 'bg-blue-50 text-blue-700 ring-blue-200',
};

const statusLabels: Record<string, string> = {
  delivered: 'Delivered',
  shipped: 'Shipped',
  processing: 'Processing',
  pending: 'Pending',
  cancelled: 'Cancelled',
  confirmed: 'Confirmed',
};

const tabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrdersPage() {
  const customerId = 'usr-001';

  const { orders, isLoading, fetchOrders } = useOrdersStore();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders({ customer_id: customerId });
  }, [fetchOrders, customerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const filtered = orders.filter((o) => {
    if (activeTab !== 'All' && statusLabels[o.status] !== activeTab && o.status !== activeTab.toLowerCase()) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const getTabCount = (tab: string) =>
    orders.filter((o) => tab === 'All' || statusLabels[o.status] === tab || o.status === tab.toLowerCase()).length;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-700 font-medium">My Orders</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all your orders in one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-full sm:w-56 bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors bg-white">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-600 transition-colors bg-white">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Processing', value: orders.filter(o => o.status === 'processing').length, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-sm text-gray-500 mb-6">Start shopping to see your orders here.</p>
          <Link href="/products">
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
              Browse Products <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Status Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto bg-gray-50/50">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-white/60'
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Products</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No orders found.</p>
                      <Link href="/products" className="text-blue-600 text-sm hover:underline mt-1 inline-block">Start Shopping</Link>
                    </td>
                  </tr>
                ) : (
                  filtered.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-gray-900">#{order.id.slice(-6).toUpperCase()}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, i) => (
                              <div key={i} className="w-9 h-9 rounded-lg overflow-hidden border-2 border-white bg-gray-50 flex-shrink-0 shadow-sm">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <div className="w-9 h-9 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-bold shadow-sm">
                                +{order.items.length - 3}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-400">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-gray-900">{order.total.toLocaleString()} Br</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${statusColor[order.status] || 'bg-gray-50 text-gray-600 ring-gray-200'}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold border border-blue-200 hover:border-blue-400 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">
                            View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-gray-50/30">
            <p className="text-xs text-gray-500">
              Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of <span className="font-semibold text-gray-700">{orders.length}</span> orders
            </p>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-100 text-gray-600 transition-colors">‹</button>
              {[1].map((p) => (
                <button key={p} className="w-7 h-7 rounded-lg text-xs font-semibold bg-blue-600 text-white">{p}</button>
              ))}
              <button className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-100 text-gray-600 transition-colors">›</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
