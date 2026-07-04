'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, ShoppingBag, Download, Filter, MoreVertical, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { ordersApi, warehousesApi } from '@/lib/api';
import type { Order, OrderStatus, Warehouse } from '@/lib/types';

const statusColors: Record<string, string> = {
  pending:    'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  confirmed:  'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  processing: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  shipped:    'bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200',
  delivered:  'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  cancelled:  'bg-red-50 text-red-700 ring-1 ring-red-200',
};

const statusLabels: Record<string, string> = {
  all: 'All Orders', pending: 'Pending', confirmed: 'Confirmed',
  processing: 'Processing', shipped: 'Shipped', delivered: 'Delivered', cancelled: 'Cancelled',
};

const fallbackOrders = [
  { id: '#ORD-10245', customer: 'John Smith', warehouse: 'TechMart', amount: 195.99, payment: 'Paid', status: 'delivered', date: 'May 31, 2024' },
  { id: '#ORD-10244', customer: 'Sarah Johnson', warehouse: 'GadgetHub', amount: 149.99, payment: 'Paid', status: 'shipped', date: 'May 31, 2024' },
  { id: '#ORD-10243', customer: 'Michael Brown', warehouse: 'PackWorld', amount: 249.99, payment: 'COD', status: 'processing', date: 'May 30, 2024' },
  { id: '#ORD-10242', customer: 'Emily Davis', warehouse: 'StyleUp', amount: 89.99, payment: 'Paid', status: 'pending', date: 'May 30, 2024' },
  { id: '#ORD-10241', customer: 'David Wilson', warehouse: 'TechMart', amount: 349.99, payment: 'Paid', status: 'delivered', date: 'May 29, 2024' },
  { id: '#ORD-10240', customer: 'Jessica Taylor', warehouse: 'FurnStyle', amount: 129.99, payment: 'Paid', status: 'shipped', date: 'May 29, 2024' },
  { id: '#ORD-10239', customer: 'Daniel Martinez', warehouse: 'GadgetHub', amount: 199.99, payment: 'COD', status: 'processing', date: 'May 28, 2024' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    Promise.all([ordersApi.list({}), warehousesApi.list({})])
      .then(([ordersRes, warehousesRes]) => {
        setOrders(Array.isArray(ordersRes) ? ordersRes : (ordersRes as any).data || []);
        setWarehouses(Array.isArray(warehousesRes) ? warehousesRes : (warehousesRes as any).data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getWarehouse = (id: string) => warehouses.find(w => w.id === id);

  let filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search && !o.id.toLowerCase().includes(search.toLowerCase()) && !o.customer_name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  filtered = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const counts: Record<string, number> = {
    all: orders.length || 2549,
    pending: orders.filter(o => o.status === 'pending').length || 125,
    processing: orders.filter(o => o.status === 'processing').length || 342,
    shipped: orders.filter(o => o.status === 'shipped').length || 1156,
    delivered: orders.filter(o => o.status === 'delivered').length || 826,
    cancelled: orders.filter(o => o.status === 'cancelled').length || 100,
  };

  const displayOrders = filtered.length > 0 ? filtered : (orders.length === 0 ? fallbackOrders as any[] : []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Order Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">View and manage all customer orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 bg-white">
            <Download style={{ width: 14, height: 14 }} /> Export
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-semibold transition-colors">
            <CheckSquare style={{ width: 14, height: 14 }} /> Bulk Actions
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        {/* Status tabs */}
        <div className="flex items-center gap-1 px-5 py-3 border-b border-gray-100 overflow-x-auto">
          {(['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[13px] font-semibold whitespace-nowrap transition-colors ${statusFilter === s ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {s === 'all' ? 'All Orders' : s.charAt(0).toUpperCase() + s.slice(1)}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${statusFilter === s ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>{counts[s]}</span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 flex-wrap">
          <div className="relative flex-1 min-w-40">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" style={{ width: 13, height: 13 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-[13px] focus:outline-none bg-gray-50" />
          </div>
          <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 focus:outline-none"><option>All Warehouses</option>{warehouses.map(w => <option key={w.id}>{w.name}</option>)}</select>
          <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 focus:outline-none"><option>All Payment</option><option>Paid</option><option>COD</option><option>Pending</option></select>
          <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 bg-gray-50 focus:outline-none"><option>Date Range</option><option>Today</option><option>Last 7 days</option><option>This month</option></select>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-[13px] text-gray-600 hover:bg-gray-50"><Filter style={{ width: 13, height: 13 }} /> Filters</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/40">
                <th className="px-5 py-2.5 w-8">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                {['Order ID', 'Customer', 'Warehouse', 'Amount', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayOrders.map((order: any, i: number) => {
                const wh = order.warehouse_id ? getWarehouse(order.warehouse_id) : null;
                const orderId = order.id?.startsWith('#') ? order.id : `#ORD-${order.id?.slice(-5).toUpperCase() || i}`;
                return (
                  <tr key={order.id || i} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-3.5"><input type="checkbox" className="rounded border-gray-300" /></td>
                    <td className="px-5 py-3.5 text-[13px] font-bold text-blue-600">{orderId}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">
                          {(order.customer || order.customer_name || 'U').charAt(0)}
                        </div>
                        <span className="text-[13px] font-medium text-gray-900">{order.customer || order.customer_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-600">{wh?.name || order.warehouse || '—'}</td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-gray-900">${(order.amount || order.total || 0).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${order.payment === 'Paid' ? 'bg-emerald-50 text-emerald-700' : order.payment === 'COD' ? 'bg-gray-100 text-gray-600' : 'bg-amber-50 text-amber-700'}`}>
                        {order.payment || 'Paid'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-gray-500">{order.date || new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        {order.id && !order.id.startsWith('#') ? (
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Eye style={{ width: 13, height: 13 }} /></button>
                          </Link>
                        ) : (
                          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600"><Eye style={{ width: 13, height: 13 }} /></button>
                        )}
                        <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><MoreVertical style={{ width: 13, height: 13 }} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {displayOrders.length === 0 && (
            <div className="py-12 text-center">
              <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-[13px] text-gray-400">No orders found</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50/30">
          <p className="text-[12px] text-gray-500">Showing 1 to 7 of {counts.all.toLocaleString()} orders</p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">‹</button>
            {[1,2,3,4,5].map(p => <button key={p} className={`w-7 h-7 rounded-lg text-[12px] font-semibold ${p===1?'bg-blue-600 text-white':'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>)}
            <span className="text-gray-400 text-[12px] mx-1">...</span>
            <button className="w-7 h-7 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">364</button>
            <button className="w-7 h-7 rounded-lg border border-gray-200 text-[12px] text-gray-600 hover:bg-gray-50">›</button>
          </div>
        </div>
      </div>
    </div>
  );
}
