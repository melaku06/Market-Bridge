'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, CheckCircle, Package, Truck, MapPin, XCircle, Clock } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/mock-db';

const STATUS_STEPS: { key: OrderStatus | 'confirmed'; label: string; icon: typeof Package }[] = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Preparing Order', icon: Clock },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: MapPin },
];

const STATUS_ORDER = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

function getStepDoneIndex(status: OrderStatus) {
  if (status === 'cancelled') return -1;
  return STATUS_ORDER.indexOf(status);
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-orange-100 text-orange-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderTrackingPage() {
  const [trackingId, setTrackingId] = useState('MB1255');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleTrack = async () => {
    const id = trackingId.replace('#', '').trim();
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    try {
      const order = await ordersApi.get(id);
      setTrackedOrder(order);
    } catch {
      setTrackedOrder(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const doneIdx = trackedOrder ? getStepDoneIndex(trackedOrder.status) : -1;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Order Tracking</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Track Your Order</h1>
        <p className="text-sm text-gray-500">Enter your order number to track your order status.</p>
      </div>

      {/* Tracking Input */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Enter Order Number</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            placeholder="e.g. MB1256"
            className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleTrack}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
          >
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Search className="w-4 h-4" />
            }
            Track Order
          </button>
        </div>
        {notFound && <p className="text-sm text-red-500 mt-2">Order not found. Please check your order number.</p>}
      </div>

      {trackedOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Timeline */}
          <div className="lg:col-span-2 space-y-4">
            {/* Order Header */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-900">Order #{trackedOrder.id}</h2>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[trackedOrder.status] || 'bg-gray-100 text-gray-600'}`}>
                      {trackedOrder.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Placed on {new Date(trackedOrder.created_at).toLocaleDateString('en-ET', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Progress Steps */}
              {trackedOrder.status !== 'cancelled' ? (
                <div className="relative">
                  <div className="flex items-center justify-between mb-2">
                    {STATUS_STEPS.map((step, i) => {
                      const done = i <= doneIdx;
                      const active = i === doneIdx;
                      return (
                        <div key={step.key} className="flex flex-col items-center flex-1">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                            done ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-400'
                          }`}>
                            <step.icon className="w-4 h-4" />
                          </div>
                          <p className={`text-xs mt-1 text-center hidden sm:block ${active ? 'font-semibold text-blue-600' : done ? 'text-gray-700' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                    <div
                      className="h-full bg-blue-600 transition-all"
                      style={{ width: `${doneIdx >= 0 ? (doneIdx / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm font-medium text-red-700">This order has been cancelled.</p>
                </div>
              )}
            </div>

            {/* Tracking Details */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4">Tracking Details</h3>
              <div className="relative pl-6">
                <div className="absolute left-2.5 top-1 bottom-1 w-0.5 bg-gray-200" />
                {STATUS_STEPS.slice(0, doneIdx + 1).map((step, i) => {
                  const isLatest = i === doneIdx;
                  const stepDate = i === 0
                    ? trackedOrder.created_at
                    : i <= doneIdx
                      ? trackedOrder.updated_at
                      : null;
                  return (
                    <div key={step.key} className="relative mb-5 last:mb-0">
                      <div className={`absolute -left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isLatest ? 'bg-blue-600 border-blue-600' : 'bg-white border-blue-300'
                      }`}>
                        {isLatest
                          ? <CheckCircle className="w-3 h-3 text-white" />
                          : <div className="w-2 h-2 rounded-full bg-blue-400" />
                        }
                      </div>
                      <div className="pl-3">
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-semibold ${isLatest ? 'text-blue-600' : 'text-gray-700'}`}>{step.label}</p>
                          {isLatest && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Current</span>}
                        </div>
                        {stepDate && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(stepDate).toLocaleString('en-ET', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping + Warehouse Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3">Shipping Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Courier</span>
                    <span className="font-medium text-gray-900">{trackedOrder.shipping_method}</span>
                  </div>
                  {trackedOrder.tracking_number && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tracking ID</span>
                      <span className="font-mono text-gray-900">{trackedOrder.tracking_number}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Address</span>
                    <span className="text-gray-900 text-right max-w-[60%]">{trackedOrder.shipping_address}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-900">{trackedOrder.subtotal.toLocaleString()} Br</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-gray-900">{trackedOrder.shipping_fee === 0 ? 'Free' : `${trackedOrder.shipping_fee.toLocaleString()} Br`}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-gray-100 pt-2 mt-2">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{trackedOrder.total.toLocaleString()} Br</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Items */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Items Ordered</h3>
              <div className="space-y-3">
                {trackedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      <p className="text-sm font-semibold text-gray-900">{(item.price * item.qty).toLocaleString()} Br</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={`/dashboard/orders/${trackedOrder.id}`}>
                <button className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  View Full Order Details
                </button>
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Payment Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="font-medium text-gray-900">{trackedOrder.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`font-medium capitalize ${
                    trackedOrder.payment_status === 'paid' ? 'text-green-600' :
                    trackedOrder.payment_status === 'refunded' ? 'text-blue-600' :
                    'text-orange-600'
                  }`}>{trackedOrder.payment_status}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-500 mb-3">Contact our support team for any order assistance.</p>
              <a
                href="mailto:support@marketbridge.com"
                className="flex items-center justify-center gap-2 w-full py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      )}

      {!trackedOrder && !notFound && !loading && (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-1">Enter your order number above to track your order.</p>
          <p className="text-sm text-gray-400">Example: MB1256</p>
        </div>
      )}
    </div>
  );
}
