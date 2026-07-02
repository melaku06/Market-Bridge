'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, Truck, CheckCircle, Clock, Package, MapPin, ExternalLink } from 'lucide-react';
import { orders } from '@/lib/data';

const statusColor: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-orange-100 text-orange-700',
  Pending: 'bg-yellow-100 text-yellow-700',
};

export default function OrderTrackingPage() {
  const [trackingId, setTrackingId] = useState('MB1255');
  const [trackedOrder, setTrackedOrder] = useState(orders[1]);
  const [searched, setSearched] = useState(true);

  const handleTrack = () => {
    const found = orders.find((o) => o.id === trackingId.replace('#', '').trim());
    if (found) { setTrackedOrder(found); setSearched(true); }
    else setSearched(false);
  };

  const timelineData = [
    { label: 'Order Placed', date: 'May 16, 10:24 AM', note: 'Your order has been placed successfully.', done: true },
    { label: 'Processing', date: 'May 18, 11:10 AM', note: 'We are preparing your items.', done: true },
    { label: 'Shipped', date: 'May 19, 09:30 AM', note: 'Your order is on the way.', done: true, active: true },
    { label: 'Out for Delivery', date: 'Expected May 22, 2024', note: 'Your order will be out for delivery.', done: false },
    { label: 'Delivered', date: 'Expected May 22, 2024', note: 'Your order will be delivered.', done: false },
  ];

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Order Tracking</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900">Track Your Order</h1>
        <p className="text-sm text-gray-500">Stay updated with your order status in real-time.</p>
      </div>

      {/* Tracking Input */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Enter Order ID or Tracking Number</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            placeholder="e.g. MB1255 or FSR123456789"
            className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={handleTrack}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Track Order
          </button>
        </div>
        {!searched && <p className="text-sm text-red-500 mt-2">Order not found. Please check your order ID.</p>}
      </div>

      {trackedOrder && searched && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Timeline */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gray-900">Order #{trackedOrder.id}</h2>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[trackedOrder.status] || 'bg-gray-100 text-gray-600'}`}>
                    {trackedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Estimated Delivery: May 22, 2024</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-6">
              <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200" />
              {timelineData.map((step, i) => (
                <div key={i} className="relative mb-6 last:mb-0">
                  <div className={`absolute -left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${step.done ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                    {step.done && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <div className="pl-4">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm font-semibold ${step.active ? 'text-blue-600' : step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                      {step.active && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Current</span>}
                    </div>
                    <p className="text-xs text-gray-400 mb-0.5">{step.date}</p>
                    <p className="text-sm text-gray-600">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Shipping Details */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Shipping Details</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Courier</p>
                  <p className="text-sm font-medium text-gray-900">FastShip Express</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Tracking Number</p>
                  <p className="text-sm font-medium text-gray-900 font-mono">FSR123456789</p>
                </div>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                Track on Courier Website
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-3">
                {trackedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={`/dashboard/orders/${trackedOrder.id}`}>
                <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  View Order Details
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
