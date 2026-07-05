'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Package, Clock, CheckCircle, DollarSign, ChevronRight, Star, Heart, ArrowRight } from 'lucide-react';
import { useOrdersStore, useProductsStore, useWishlistStore, useNotificationsStore } from '@/stores';
import { useAuth } from '@/components/auth/auth-provider';

const statusColor: Record<string, string> = {
  delivered: 'bg-emerald-50 text-emerald-700',
  shipped: 'bg-blue-50 text-blue-700',
  processing: 'bg-amber-50 text-amber-700',
  pending: 'bg-amber-50 text-amber-700',
  cancelled: 'bg-red-50 text-red-700',
};

const statusLabel: Record<string, string> = {
  delivered: 'Delivered',
  shipped: 'Shipped',
  processing: 'Processing',
  pending: 'Pending',
  cancelled: 'Cancelled',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { orders, fetchOrders, isLoading: ordersLoading } = useOrdersStore();
  const { products, fetchProducts } = useProductsStore();
  const { fetchWishlist, totalItems: wishlistTotal } = useWishlistStore();
  const { fetchNotifications } = useNotificationsStore();

  const customerId = user?.id;

  useEffect(() => {
    if (!customerId) return;
    fetchOrders({ customer_id: customerId });
    fetchProducts({ status: 'published', limit: 10 });
    fetchWishlist(customerId);
    fetchNotifications({ user_id: customerId });
  }, [fetchOrders, fetchProducts, fetchWishlist, fetchNotifications, customerId]);

  if (!user || !customerId) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const recentOrders = orders.slice(0, 4);
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  return (
    <div className="space-y-5">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Hello, {user?.name?.split(' ')[0] || 'Sarah'}! 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back to MarketBridge. Explore and shop the best products.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Orders', value: orders.length, sub: 'View all orders', href: '/dashboard/orders', icon: Package, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
          { label: 'Pending Orders', value: pendingCount, sub: 'Track now', href: '/dashboard/order-tracking', icon: Clock, iconColor: 'text-orange-600', iconBg: 'bg-orange-50' },
          { label: 'Delivered Orders', value: deliveredCount, sub: 'View history', href: '/dashboard/orders', icon: CheckCircle, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
          { label: 'Total Spent', value: `$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, sub: 'This year', href: '#', icon: DollarSign, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[12px] text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-9 h-9 ${stat.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${stat.iconColor}`} />
                  </div>
                </div>
                <p className="text-[11px] text-blue-600 font-medium">{stat.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <h2 className="text-[13px] font-bold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-[12px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ChevronRight style={{ width: 14, height: 14 }} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No orders yet</p>
              <Link href="/products">
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">Browse Products</button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition-colors">
                  <div className="flex -space-x-2 flex-shrink-0">
                    {(order.items || []).slice(0, 2).map((item: any, i: number) => (
                      <div key={i} className="w-9 h-9 rounded-lg overflow-hidden border-2 border-white bg-gray-100 flex-shrink-0 shadow-sm">
                        <img src={item.product_image || '/placeholder.jpg'} alt={item.product_name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-900">Order #MB{order.id.slice(-5).toUpperCase()}</p>
                    <p className="text-[11px] text-gray-400">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {statusLabel[order.status] || order.status}
                  </span>
                  <p className="text-[13px] font-bold text-gray-900 flex-shrink-0">${order.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Exclusive Deals */}
          <div className="rounded-xl p-4 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)' }}>
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
            <div className="absolute right-2 bottom-2 w-24 h-24 bg-white/5 rounded-full" />
            <div className="relative">
              <p className="text-[11px] font-semibold text-purple-200 mb-0.5">Exclusive Deals</p>
              <h3 className="font-bold text-base mb-1 leading-tight">Just for You!</h3>
              <p className="text-[11px] text-purple-200 mb-3">Get up to 30% off on selected items.</p>
              <div className="flex -space-x-2 mb-3">
                {products.slice(0, 2).map((p, i) => (
                  <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white/30 bg-white/10 flex-shrink-0">
                    <img src={p.images?.[0] || ''} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <Link href="/products">
                <button className="flex items-center gap-1.5 bg-white text-purple-700 hover:bg-purple-50 text-[11px] font-bold px-4 py-1.5 rounded-lg transition-colors">
                  Shop Now <ArrowRight style={{ width: 12, height: 12 }} />
                </button>
              </Link>
            </div>
          </div>

          {/* Wishlist Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center">
                <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              </div>
              <h3 className="text-[13px] font-bold text-gray-900">Your Wishlist Summary</h3>
            </div>
            <p className="text-[12px] text-gray-500 mb-3">
              <span className="text-xl font-bold text-gray-900 mr-1">{wishlistTotal()}</span>
              items in your wishlist
            </p>
            <Link href="/wishlist">
              <button className="w-full py-2 border border-gray-200 rounded-lg text-[12px] font-semibold hover:bg-gray-50 transition-colors text-gray-700">
                View Wishlist
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
          <h2 className="text-[13px] font-bold text-gray-900">Recommended for You</h2>
          <Link href="/products" className="text-[12px] text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All <ChevronRight style={{ width: 14, height: 14 }} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
          {products.slice(2, 6).map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="group rounded-xl overflow-hidden border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                <div className="aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={product.images?.[0] || ''}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[12px] font-medium text-gray-900 line-clamp-2 mb-1 leading-snug">{product.name}</p>
                  <p className="text-[13px] font-bold text-gray-900">{((Number(product.base_price) * (1 + Number(product.margin_percent) / 100)) || 0).toLocaleString()} Br</p>
                  <div className="flex items-center gap-0.5 mt-1 mb-2">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-[11px] text-gray-500">{product.rating}</span>
                    {product.review_count > 0 && <span className="text-[11px] text-gray-400 ml-0.5">({product.review_count})</span>}
                  </div>
                  <button className="w-full py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-[11px] font-semibold transition-colors">
                    View Product
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
