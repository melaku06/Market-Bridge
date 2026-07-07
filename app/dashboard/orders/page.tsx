'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, Package, ChevronRight, Search } from 'lucide-react';
import { useOrdersStore } from '@/stores';

const statusColor: Record<string, string> = {
  delivered: 'bg-emerald-50 text-emerald-700',
  shipped: 'bg-blue-50 text-blue-700',
  processing: 'bg-amber-50 text-amber-700',
  pending: 'bg-amber-50 text-amber-700',
  cancelled: 'bg-red-50 text-red-700',
  confirmed: 'bg-blue-50 text-blue-700',
};

const statusLabels: Record<string, string> = {
  delivered: 'Delivered',
  shipped: 'Shipped',
  processing: 'Processing',
  pending: 'Pending',
  cancelled: 'Cancelled',
  confirmed: 'Confirmed',
};

const PAGE_SIZE = 6;

export default function OrdersPage() {
  const customerId = 'usr-001';
  const { orders, isLoading, fetchOrders } = useOrdersStore();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchOrders({ customer_id: customerId });
  }, [fetchOrders, customerId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    const matchesId = o.id.toLowerCase().includes(searchLower);
    const matchesOrderNumber = o.order_number?.toLowerCase().includes(searchLower);
    const matchesItems = (o.items || []).some((i: any) =>
      (i.product_name || i.name || '').toLowerCase().includes(searchLower)
    );
    return matchesId || matchesOrderNumber || matchesItems;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Breadcrumb + Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <span className="text-gray-700 font-medium">My Orders</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 14, height: 14 }} />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:border-blue-500 focus:outline-none w-44 bg-gray-50 focus:bg-white transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-medium hover:bg-gray-50 text-gray-600 bg-white transition-colors">
            <SlidersHorizontal style={{ width: 14, height: 14 }} />
            Filters
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-sm text-gray-500 mb-5">Start shopping to see your orders here.</p>
          <Link href="/products">
            <button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 transition-colors">
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[13px] text-gray-400">
                      No orders match your search.
                    </td>
                  </tr>
                ) : (
                  paginated.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-[13px] font-semibold text-gray-900">#MB{order.id.slice(-5).toUpperCase()}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[13px] text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5">
                            {(order.items || []).slice(0, 3).map((item: any, i: number) => (
                              <div key={i} className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white bg-gray-50 flex-shrink-0 shadow-sm">
                                <img src={item.product_image || '/placeholder.jpg'} alt={item.product_name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            {(order.items?.length || 0) > 3 && (
                              <div className="w-8 h-8 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[9px] text-gray-500 font-bold shadow-sm">
                                +{(order.items?.length || 0) - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[13px] font-bold text-gray-900">{order.total.toLocaleString()} Br</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-md ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Link href={`/dashboard/orders/${order.id}`}>
                          <button className="text-[12px] text-blue-600 hover:text-blue-700 font-semibold border border-blue-200 hover:border-blue-400 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all">
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
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <p className="text-[12px] text-gray-500">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)} to {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} orders
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-[13px] hover:bg-gray-50 text-gray-500 disabled:opacity-40 transition-colors"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-[12px] font-semibold transition-colors ${page === p ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-[13px] hover:bg-gray-50 text-gray-500 disabled:opacity-40 transition-colors"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
