'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Package, Clock, CheckCircle, DollarSign, ChevronRight, Star, Heart, ShoppingBag, ArrowRight, TrendingUp, Truck } from 'lucide-react';
import { useOrdersStore, useProductsStore, useWishlistStore, useNotificationsStore } from '@/stores';
import { useAuth } from '@/components/auth/auth-provider';

const statusColor: Record<string, string> = {
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  shipped: 'bg-blue-50 text-blue-700 ring-blue-200',
  processing: 'bg-orange-50 text-orange-700 ring-orange-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  cancelled: 'bg-red-50 text-red-700 ring-red-200',
};

const statusLabels: Record<string, string> = {
  delivered: 'Delivered',
  shipped: 'Shipped',
  processing: 'Processing',
  pending: 'Pending',
  cancelled: 'Cancelled',
};

export default function DashboardPage() {
  const customerId = 'usr-001';

  const { user } = useAuth();
  const { orders, fetchOrders, isLoading: ordersLoading } = useOrdersStore();
  const { products, fetchProducts, isLoading: productsLoading } = useProductsStore();
  const { items: wishlistItems, fetchWishlist, totalItems: wishlistTotal } = useWishlistStore();
  const { unreadCount, fetchNotifications } = useNotificationsStore();

  const loading = ordersLoading || productsLoading;

  useEffect(() => {
    fetchOrders({ customer_id: customerId });
    fetchProducts({ status: 'published', limit: 10 });
    fetchWishlist(customerId);
    fetchNotifications({ user_id: customerId });
  }, [fetchOrders, fetchProducts, fetchWishlist, fetchNotifications, customerId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);
  const recommended = products.slice(2, 6);
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Hello, {user?.name?.split(' ')[0] || 'Sarah'}!
          </h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back to MarketBridge. Here's what's happening.</p>
        </div>
        <Link href="/products">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-blue-600/20">
            <ShoppingBag className="w-4 h-4" />
            Shop Now
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Orders',
            value: orders.length,
            sub: 'All time',
            href: '/dashboard/orders',
            icon: Package,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-t-blue-500',
          },
          {
            label: 'Pending Orders',
            value: pendingCount,
            sub: 'In progress',
            href: '/dashboard/orders',
            icon: Clock,
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-t-orange-500',
          },
          {
            label: 'Delivered',
            value: deliveredCount,
            sub: 'Completed',
            href: '/dashboard/orders',
            icon: CheckCircle,
            iconColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
            borderColor: 'border-t-emerald-500',
          },
          {
            label: 'Total Spent',
            value: `${totalSpent.toLocaleString()} Br`,
            sub: 'This year',
            href: '#',
            icon: DollarSign,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-t-blue-500',
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href}>
              <div className={`bg-white rounded-2xl border border-gray-100 border-t-4 ${stat.borderColor} p-5 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer`}>
                <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
                <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
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
                <div key={order.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex -space-x-2 flex-shrink-0">
                    {order.items.slice(0, 2).map((item, i) => (
                      <div key={i} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-white bg-gray-100 flex-shrink-0 shadow-sm">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">#{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-gray-500 mb-0.5">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ring-1 ${statusColor[order.status] || 'bg-gray-50 text-gray-600 ring-gray-200'}`}>
                    {statusLabels[order.status] || order.status}
                  </span>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">{order.total.toLocaleString()} Br</p>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <button className="text-xs text-blue-600 font-medium hover:underline flex-shrink-0">Details</button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Exclusive Deals Banner */}
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -right-2 -bottom-6 w-32 h-32 bg-white/5 rounded-full" />
            <div className="relative">
              <span className="inline-block text-xs bg-white/20 text-white px-2 py-0.5 rounded-full mb-2 font-medium">Limited Time</span>
              <h3 className="font-bold text-lg mb-1 leading-tight">Exclusive Deals<br />Just for You!</h3>
              <p className="text-xs text-blue-100 mb-4">Get up to 30% off on selected items.</p>
              <div className="flex -space-x-2 mb-4">
                {recommended.slice(0, 3).map((p, i) => (
                  <div key={i} className="w-11 h-11 rounded-lg overflow-hidden border-2 border-white/40 bg-white/10">
                    <img src={p.images?.[0] || ''} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <Link href="/products">
                <button className="flex items-center gap-1.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                  Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>

          {/* Wishlist Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Your Wishlist</h3>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              <span className="text-2xl font-bold text-gray-900 mr-1">{wishlistTotal()}</span>
              saved items
            </p>
            <Link href="/wishlist">
              <button className="w-full py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors text-gray-700">
                View Wishlist
              </button>
            </Link>
          </div>

          {/* Shipping Status Mini */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">Shipping</h3>
            </div>
            <div className="space-y-2">
              {orders.filter(o => o.status === 'shipped' || o.status === 'processing').slice(0, 2).map(o => (
                <Link key={o.id} href={`/dashboard/order-tracking`} className="flex items-center justify-between text-xs hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-lg transition-colors">
                  <span className="font-medium text-gray-700">#{o.id.slice(-6).toUpperCase()}</span>
                  <span className={`px-2 py-0.5 rounded-full font-medium ${statusColor[o.status]}`}>{statusLabels[o.status]}</span>
                </Link>
              ))}
              {orders.filter(o => o.status === 'shipped' || o.status === 'processing').length === 0 && (
                <p className="text-xs text-gray-400">No active shipments.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recommended For You</h2>
          <Link href="/products" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-5">
          {recommended.map((product) => (
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
                  <p className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">{product.name}</p>
                  <p className="text-sm font-bold text-blue-600">{(product.final_price ?? 0).toLocaleString()} Br</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">{product.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
