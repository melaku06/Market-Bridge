'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight, Download, MapPin, CreditCard, Truck, CheckCircle, Loader2 } from 'lucide-react';
import { ordersApi } from '@/lib/api';
import type { Order } from '@/lib/mock-db';

const statusColor: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  shipped: 'bg-blue-100 text-blue-700',
  processing: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-indigo-100 text-indigo-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const timelineSteps = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

function getStepIndex(status: string): number {
  const map: Record<string, number> = {
    pending: 0, confirmed: 0, processing: 1, shipped: 2, delivered: 4, cancelled: -1,
  };
  return map[status] ?? 0;
}

function formatStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function OrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const orderData = await ordersApi.get(params.id as string);
        setOrder(orderData);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Order not found</h2>
        <Link href="/dashboard/orders">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            Back to Orders
          </button>
        </Link>
      </div>
    );
  }

  const currentStep = getStepIndex(order.status);

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/dashboard/orders" className="hover:text-blue-600">My Orders</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Order #{order.id}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900">Order #{order.id}</h1>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
              {formatStatus(order.status)}
            </span>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Download Invoice
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">Placed on {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</p>
      </div>

      {/* Order Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left - Main Info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Delivery + Payment + Shipping Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-gray-900">Shipping Address</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{order.shipping_address}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-gray-900">Payment Method</p>
                </div>
                <p className="text-sm text-gray-600">{order.payment_method}</p>
                <button className="text-xs text-blue-600 hover:underline mt-1">View Payment Details</button>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-semibold text-gray-900">Shipping Method</p>
                </div>
                <p className="text-sm text-gray-600">{order.shipping_method || 'Standard Shipping'}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {(order.items || []).map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <img src={item.image || '/placeholder.jpg'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{item.price.toLocaleString()} Br</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          {order.status !== 'cancelled' && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-bold text-gray-900 mb-5">Order Progress</h2>
              <div className="relative flex items-center justify-between">
                {timelineSteps.map((step, i) => {
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={step} className="flex flex-col items-center flex-1 relative">
                      {i < timelineSteps.length - 1 && (
                        <div className={`absolute top-4 left-1/2 w-full h-0.5 ${i < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                      )}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 ${done ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200'}`}>
                        {done ? <CheckCircle className="w-4 h-4 text-white" /> : <span className="w-2 h-2 bg-gray-300 rounded-full" />}
                      </div>
                      <p className={`text-xs mt-2 text-center ${active ? 'font-semibold text-blue-600' : done ? 'text-gray-700' : 'text-gray-400'}`}>{step}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right - Summary */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="font-medium">{order.subtotal.toLocaleString()} Br</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span className="font-medium text-green-600">Free</span></div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span className="font-medium text-red-500">-{order.discount.toLocaleString()} Br</span></div>
              )}
              <div className="flex justify-between text-sm"><span className="text-gray-500">Tax</span><span className="font-medium">{order.tax.toLocaleString()} Br</span></div>
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900 text-lg">{order.total.toLocaleString()} Br</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
            {order.status === 'pending' || order.status === 'processing' ? (
              <button className="w-full py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                Cancel Order
              </button>
            ) : null}
            {order.status === 'shipped' ? (
              <Link href="/dashboard/order-tracking">
                <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                  Track Package
                </button>
              </Link>
            ) : null}
            {order.status === 'delivered' && (
              <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                Leave a Review
              </button>
            )}
            <Link href="/dashboard/orders">
              <button className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                Back to Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
