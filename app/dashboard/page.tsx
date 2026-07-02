'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Clock, CheckCircle, DollarSign, ChevronRight, Star, Heart } from 'lucide-react';
import { ordersApi, productsApi, wishlistApi } from '@/lib/api';
import type { Order, Product } from '@/lib/mock-db';

const statusColor: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  shipped: 'bg-blue-100 text-blue-700',
  processing: 'bg-orange-100 text-orange-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels: Record<string, string> = {
  delivered: 'Delivered',
  shipped: 'Shipped',
  processing: 'Processing',
  pending: 'Pending',
  cancelled: 'Cancelled',
};

export default function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const customerId = 'usr-001';
        const [ordersRes, productsRes, wishlistRes] = await Promise.all([
          ordersApi.list({ customer_id: customerId }),
          productsApi.list({ status: 'published', limit: 10 }),
          wishlistApi.list(customerId),
        ]);
        // Handle both { data: [...] } and direct array responses
        const ordersData = Array.isArray(ordersRes) ? ordersRes : (ordersRes as { data?: Order[] }).data || [];
        const productsData = Array.isArray(productsRes) ? productsRes : (productsRes as { data?: Product[] }).data || [];
        setOrders(ordersData);
        setRecommended(productsData.slice(2, 6));
        setWishlistCount(Array.isArray(wishlistRes) ? wishlistRes.length : 0);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const recentOrders = orders.slice(0, 4);
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Hello, Sarah!</h1>
        <p className="text-gray-500 text-sm">Welcome back to MarketBridge. Explore and shop the best products.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length.toString(), sub: 'View all orders', href: '/dashboard/orders', icon: <Package className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
          { label: 'Pending Orders', value: pendingCount.toString(), sub: 'Track now', href: '/dashboard/orders', icon: <Clock className="w-5 h-5 text-yellow-600" />, bg: 'bg-yellow-50' },
          { label: 'Delivered Orders', value: deliveredCount.toString(), sub: 'View history', href: '/dashboard/orders', icon: <CheckCircle className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
          { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, sub: 'This year', href: '#', icon: <DollarSign className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="bg-white rounded-xl border border-gray-100 p-4 hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>{stat.icon}</div>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
              <p className="text-xs font-medium text-gray-500">{stat.label}</p>
              <p className="text-xs text-blue-600 mt-1">{stat.sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center gap-3 p-4">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 2).map((item, i) => (
                    <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white bg-gray-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">Order #{order.id}</p>
                  <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {statusLabels[order.status] || order.status}
                </span>
                <p className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Exclusive Deals Banner */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 text-white relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -right-8 -top-4 w-20 h-20 bg-white/10 rounded-full" />
            <h3 className="font-bold mb-1">Exclusive Deals<br />Just for You!</h3>
            <p className="text-xs text-blue-200 mb-3">Get up to 30% off on selected items.</p>
            <Link href="/products">
              <button className="bg-white text-blue-700 hover:bg-blue-50 text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors">
                Shop Now
              </button>
            </Link>
            <div className="mt-3 flex -space-x-2">
              {recommended.slice(0, 2).map((p, i) => (
                <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white/30">
                  <img src={p.images?.[0] || ''} alt={p.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Wishlist Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                <h3 className="font-bold text-gray-900 text-sm">Your Wishlist Summary</h3>
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-3">{wishlistCount} items in your wishlist</p>
            <Link href="/wishlist">
              <button className="w-full py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                View Wishlist
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recommended for You</h2>
          <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-5">
          {recommended.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="group">
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-2">
                  <img src={product.images?.[0] || ''} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                </div>
                <p className="text-xs font-medium text-gray-900 line-clamp-1">{product.name}</p>
                <p className="text-xs font-bold text-blue-600 mt-0.5">${(product.final_price ?? 0).toFixed(2)}</p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs text-gray-500">{product.rating}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
