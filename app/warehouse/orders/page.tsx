'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, ShoppingBag, ChevronLeft, ChevronRight, Filter, Truck, Clock } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Order, OrderStatus } from '@/lib/types';

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-100',
  confirmed: 'bg-blue-50 text-blue-700 border border-blue-100',
  processing: 'bg-violet-50 text-violet-700 border border-violet-100',
  shipped: 'bg-cyan-50 text-cyan-700 border border-cyan-100',
  delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  cancelled: 'bg-red-50 text-red-700 border border-red-100',
};
const PAYMENT_BADGE: Record<string, string> = {
  paid: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  cod: 'bg-amber-50 text-amber-700 border border-amber-100',
  unpaid: 'bg-red-50 text-red-700 border border-red-100',
};

const TABS = ['All Orders', 'New', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const;
type Tab = typeof TABS[number];

const TAB_MAP: Record<Tab, OrderStatus[]> = {
  'All Orders': [],
  'New': ['pending', 'confirmed'] as OrderStatus[],
  'Processing': ['processing'] as OrderStatus[],
  'Shipped': ['shipped'] as OrderStatus[],
  'Delivered': ['delivered'] as OrderStatus[],
  'Cancelled': ['cancelled'] as OrderStatus[],
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('All Orders');

  useEffect(() => {
    const wid = user?.warehouse_id;
    if (!wid) return;
    ordersApi.list({ warehouse_id: wid })
      .then((res: any) => setOrders(Array.isArray(res) ? res : res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.warehouse_id]);

  const tabFilter = (o: Order) => {
    const statuses = TAB_MAP[activeTab];
    return statuses.length === 0 || statuses.includes(o.status);
  };

  const filtered = orders.filter(o =>
    tabFilter(o) &&
    (search === '' || o.id?.toLowerCase().includes(search.toLowerCase()) || o.customer_name?.toLowerCase().includes(search.toLowerCase()))
  );

  const tabCount = (tab: Tab) => {
    const statuses = TAB_MAP[tab];
    return statuses.length === 0 ? orders.length : orders.filter(o => statuses.includes(o.status)).length;
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage and fulfill customer orders</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-5 overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {tab}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-500'}`}>
                {tabCount(tab)}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 13, height: 13 }} />
            <input type="text" placeholder="Search by order ID or customer…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-4 h-9 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />
          </div>
          <button className="flex items-center gap-2 px-3 h-9 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter style={{ width: 13, height: 13 }} /> Payment
          </button>
          <button className="flex items-center gap-2 px-3 h-9 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter style={{ width: 13, height: 13 }} /> Date
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/70">
                {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-14 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <ShoppingBag style={{ width: 36, height: 36 }} />
                    <p className="text-sm">No orders found</p>
                  </div>
                </td></tr>
              ) : filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="text-sm font-bold text-purple-600">#{(order.id || '').slice(-8).toUpperCase()}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                        {(order.customer_name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate max-w-[140px]">{order.customer_name || 'Customer'}</p>
                        <p className="text-[11px] text-gray-400 truncate">{order.customer_email || ''}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-600">{order.items?.length ?? 0}</td>
                  <td className="px-4 py-3.5 text-sm font-bold text-gray-900">{Number(order.total || 0).toFixed(2)} Br</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${PAYMENT_BADGE[order.payment_status || 'unpaid'] || 'bg-gray-100 text-gray-500'}`}>
                      {order.payment_method === 'cash_on_delivery' ? 'COD' : order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[order.status] || 'bg-gray-100 text-gray-500'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-400">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <Link href={`/warehouse/orders/${order.id}`}>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors" title="View">
                          <Eye style={{ width: 15, height: 15 }} />
                        </button>
                      </Link>
                      {(order.status === 'pending' || order.status === 'confirmed') && (
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Process">
                          <Clock style={{ width: 15, height: 15 }} />
                        </button>
                      )}
                      {order.status === 'processing' && (
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors" title="Mark Shipped">
                          <Truck style={{ width: 15, height: 15 }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-50">
          <p className="text-xs text-gray-500">Showing {filtered.length} of {orders.length} orders</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Per page:</span>
            <select className="border border-gray-200 rounded-lg px-2 py-1 text-xs text-gray-600 focus:outline-none cursor-pointer bg-white">
              <option>10</option><option>25</option><option>50</option>
            </select>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-40" disabled>
                <ChevronLeft style={{ width: 13, height: 13 }} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold text-white" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition-colors">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors">
                <ChevronRight style={{ width: 13, height: 13 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
