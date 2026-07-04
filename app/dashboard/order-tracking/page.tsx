'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, CheckCircle, Package, Truck, MapPin, XCircle, Clock, ArrowRight } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import type { Order, OrderStatus } from '@/lib/types';

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

const STATUS_DESCRIPTIONS: Record<string, string> = {
  pending: 'Your order has been placed successfully.',
  confirmed: 'Your order has been confirmed.',
  processing: 'We are preparing your order.',
  shipped: 'Your order has been shipped.',
  delivered: 'Your order has been delivered.',
};

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  confirmed: 'bg-violet-50 text-violet-700 ring-violet-200',
  processing: 'bg-orange-50 text-orange-700 ring-orange-200',
  shipped: 'bg-blue-50 text-blue-700 ring-blue-200',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
};

export default function OrderTrackingPage() {
  const [trackingId, setTrackingId] = useState('');
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

  const formatDate = (date: string | Date, includeTime = false) => {
    const d = new Date(date);
    const opts: Intl.DateTimeFormatOptions = includeTime
      ? { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { month: 'long', day: 'numeric', year: 'numeric' };
    return d.toLocaleDateString('en-US', opts);
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-700 font-medium">Order Tracking</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Track Your Order</h1>
        <p className="text-sm text-gray-500 mt-1">Enter your order number to track your order status.</p>
      </div>

      {/* Tracking Input */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-700 mb-3">Order Number</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            placeholder="Enter order number (e.g. MB123456789)"
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white"
          />
          <button
            onClick={handleTrack}
            disabled={loading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm shadow-blue-600/20"
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
        <>
          {/* Order Header + Progress */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="font-bold text-gray-900 text-lg">Order #{trackedOrder.id.slice(-6).toUpperCase()}</h2>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ring-1 capitalize ${statusColors[trackedOrder.status] || 'bg-gray-50 text-gray-600 ring-gray-200'}`}>
                    {trackedOrder.status === 'delivered' ? 'Delivered' : trackedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Placed on {formatDate(trackedOrder.created_at)} at {new Date(trackedOrder.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            {trackedOrder.status !== 'cancelled' ? (
              <div className="relative">
                <div className="flex items-start justify-between relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${doneIdx >= 0 ? (doneIdx / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
                    />
                  </div>

                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= doneIdx;
                    const active = i === doneIdx;
                    const StepIcon = step.icon;
                    return (
                      <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          done
                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/30'
                            : 'bg-white border-gray-200 text-gray-400'
                        }`}>
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <p className={`text-xs mt-2 text-center font-medium hidden sm:block ${
                          active ? 'text-blue-600 font-semibold' : done ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                        {done && (
                          <p className="text-[10px] text-gray-400 text-center hidden sm:block mt-0.5">
                            {formatDate(i === 0 ? trackedOrder.created_at : trackedOrder.updated_at, false)}
                          </p>
                        )}
                      </div>
                    );
                  })}
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-5">Tracking Details</h3>
            <div className="relative pl-7">
              <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-gray-200" />
              {STATUS_STEPS.slice(0, doneIdx + 1).map((step, i) => {
                const isLatest = i === doneIdx;
                const stepDate = i === 0 ? trackedOrder.created_at : trackedOrder.updated_at;
                return (
                  <div key={step.key} className="relative mb-6 last:mb-0">
                    <div className={`absolute -left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isLatest ? 'bg-blue-600 border-blue-600' : 'bg-white border-blue-300'
                    }`}>
                      {isLatest
                        ? <div className="w-2 h-2 rounded-full bg-white" />
                        : <div className="w-2 h-2 rounded-full bg-blue-400" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-semibold ${isLatest ? 'text-blue-600' : 'text-gray-700'}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-400">{formatDate(stepDate, true)}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{STATUS_DESCRIPTIONS[step.key as string] || ''}</p>
                      {isLatest && trackedOrder.status === 'delivered' && (
                        <p className="text-xs text-gray-500 mt-0.5">Delivered to: <span className="font-medium text-gray-700">{trackedOrder.shipping_address?.split(',')[0]}</span></p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping + Warehouse Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Shipping Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Courier Partner</span>
                  <span className="font-medium text-gray-900">{trackedOrder.shipping_method || 'MarketBridge Express'}</span>
                </div>
                {trackedOrder.tracking_number && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tracking ID</span>
                    <span className="font-mono text-gray-900 text-xs">{trackedOrder.tracking_number}</span>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500 flex-shrink-0">Shipping Address</span>
                  <span className="text-gray-900 text-right text-xs">{trackedOrder.shipping_address}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-4">Warehouse Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Warehouse Name</span>
                  <span className="font-medium text-gray-900">MarketBridge Warehouse</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-900">New York, USA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contact</span>
                  <span className="font-medium text-gray-900">+1 (555) 987-6543</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900 text-xs">support@marketbridge.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {trackedOrder.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    {(item as any).color && <p className="text-xs text-gray-500">Color: {(item as any).color}</p>}
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">{(item.price * item.qty).toLocaleString()} Br</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">{trackedOrder.subtotal.toLocaleString()} Br</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-gray-900">{trackedOrder.shipping_fee === 0 ? 'Free' : `${trackedOrder.shipping_fee.toLocaleString()} Br`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax</span>
                <span className="text-gray-900">{((trackedOrder.total - trackedOrder.subtotal - trackedOrder.shipping_fee) || 0).toLocaleString()} Br</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-100 pt-2 mt-2">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900 text-lg">{trackedOrder.total.toLocaleString()} Br</span>
              </div>
            </div>

            <Link href={`/dashboard/orders/${trackedOrder.id}`}>
              <button className="mt-4 w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700 flex items-center justify-center gap-2">
                View Full Order Details <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Need Help */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-1">Need Help?</h3>
            <p className="text-sm text-gray-500 mb-3">Contact our support team for any assistance.</p>
            <a
              href="mailto:support@marketbridge.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700"
            >
              Contact Support
            </a>
          </div>
        </>
      )}

      {!trackedOrder && !notFound && !loading && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-gray-700 font-medium mb-1">Enter your order number above to track your order.</p>
          <p className="text-sm text-gray-400">Example: MB1234567</p>
        </div>
      )}
    </div>
  );
}
