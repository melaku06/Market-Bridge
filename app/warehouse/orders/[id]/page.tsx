'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle2, Clock, Truck, ShoppingBag } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/lib/types';

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border border-amber-100',
  confirmed: 'bg-blue-50 text-blue-700 border border-blue-100',
  processing: 'bg-violet-50 text-violet-700 border border-violet-100',
  shipped: 'bg-cyan-50 text-cyan-700 border border-cyan-100',
  delivered: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  cancelled: 'bg-red-50 text-red-700 border border-red-100',
};

const TIMELINE_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: ShoppingBag },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    ordersApi.get(id).then(setOrder).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="flex items-center justify-center py-32">
      <p className="text-sm text-gray-400">Order not found.</p>
    </div>
  );

  const statusIdx = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === 'cancelled';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/warehouse/orders">
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft style={{ width: 15, height: 15 }} />Back
          </button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Order #{(order.id || '').slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Placed on {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { dateStyle: 'medium' }) : '—'}
          </p>
        </div>
        <span className={`text-sm font-semibold px-3 py-1.5 rounded-full capitalize ${STATUS_BADGE[order.status] || 'bg-gray-100 text-gray-600'}`}>
          {order.status}
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Subtotal', value: `${Number(order.subtotal || 0).toFixed(2)} Br`, icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-100' },
          { label: 'Shipping', value: `${Number(order.shipping_fee || 0).toFixed(2)} Br`, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Tax', value: `${Number(order.tax || 0).toFixed(2)} Br`, icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Total', value: `${Number(order.total || 0).toFixed(2)} Br`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={s.color} style={{ width: 16, height: 16 }} />
              </div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="text-sm font-bold text-gray-900">Ordered Items ({order.items?.length || 0})</h2>
            </div>
            <div className="divide-y divide-gray-50">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
                    {item.product_image
                      ? <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Package className="text-gray-300" style={{ width: 20, height: 20 }} /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.product_name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                    {(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)} Br
                  </p>
                </div>
              ))}
            </div>
            {/* Total */}
            <div className="px-5 py-4 border-t border-gray-50 space-y-2">
              <Row label="Subtotal" value={`${Number(order.subtotal || 0).toFixed(2)} Br`} />
              <Row label="Shipping Fee" value={`${Number(order.shipping_fee || 0).toFixed(2)} Br`} />
              {order.discount > 0 && <Row label="Discount" value={`-${Number(order.discount).toFixed(2)} Br`} isNeg />}
              <Row label="Tax" value={`${Number(order.tax || 0).toFixed(2)} Br`} />
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-base font-bold text-purple-600">{Number(order.total || 0).toFixed(2)} Br</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {!isCancelled && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-5">Order Timeline</h2>
              <div className="relative">
                <div className="absolute left-4 top-5 bottom-0 w-0.5 bg-gray-100" />
                <div className="space-y-0">
                  {TIMELINE_STEPS.map((step, i) => {
                    const done = i <= statusIdx;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${done ? 'bg-purple-600 border-purple-600' : 'bg-white border-gray-200'}`}>
                          <Icon className={done ? 'text-white' : 'text-gray-300'} style={{ width: 14, height: 14 }} />
                        </div>
                        <div className="pt-1">
                          <p className={`text-sm font-semibold ${done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                          {done && i === statusIdx && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {order.updated_at ? new Date(order.updated_at).toLocaleString() : 'Recently'}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {(order.status === 'pending' || order.status === 'confirmed') && (
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                <Clock style={{ width: 15, height: 15 }} /> Start Processing
              </button>
            )}
            {order.status === 'processing' && (
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                style={{ background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' }}>
                <Truck style={{ width: 15, height: 15 }} /> Mark as Shipped
              </button>
            )}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Customer</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                {(order.customer_name || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{order.customer_name || '—'}</p>
                <p className="text-xs text-gray-400">{order.customer_email || '—'}</p>
              </div>
            </div>
            <div className="space-y-2.5 text-xs">
              <InfoRow label="Payment" value={
                <span className={`font-semibold px-2 py-0.5 rounded-full capitalize text-[11px] ${
                  order.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {order.payment_method === 'cash_on_delivery' ? 'COD' : order.payment_status}
                </span>
              } />
              <InfoRow label="Order Date" value={order.created_at ? new Date(order.created_at).toLocaleDateString() : '—'} />
              <InfoRow label="Items" value={`${order.items?.length || 0} items`} />
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="text-purple-500" style={{ width: 15, height: 15 }} />
              Shipping Address
            </h3>
            {order.shipping_address ? (
              <div className="text-xs text-gray-600 space-y-1 leading-relaxed">
                <p className="font-medium text-gray-800">{order.shipping_address.full_name}</p>
                <p>{order.shipping_address.address_line1}</p>
                {order.shipping_address.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                <p>{order.shipping_address.country}</p>
                {order.shipping_address.phone && <p className="text-gray-400">{order.shipping_address.phone}</p>}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No address provided</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, isNeg }: { label: string; value: string; isNeg?: boolean }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-gray-500">{label}</span>
      <span className={`font-medium ${isNeg ? 'text-emerald-600' : 'text-gray-700'}`}>{value}</span>
    </div>
  );
}
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-700">{value}</span>
    </div>
  );
}
