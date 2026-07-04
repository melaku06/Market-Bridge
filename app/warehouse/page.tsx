'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp, AlertTriangle, Clock, Warehouse as WarehouseIcon, Star, Plus, ArrowUpRight, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { warehousesApi, ordersApi, inventoryApi, analyticsApi } from '@/lib/api';
import { useAuth } from '@/components/auth/auth-provider';
import type { Warehouse, Order, Inventory } from '@/lib/types';

export default function WarehouseDashboard() {
  const { user } = useAuth();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [analytics, setAnalytics] = useState<{ revenue: { today: number; week: number; month: number; total: number }; orders: { total: number; active: number; completed: number; cancelled: number } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const warehouseId = user?.warehouse_id;
      if (!warehouseId) return;
      try {
        const [warehouseRes, ordersRes, inventoryRes, analyticsRes] = await Promise.all([
          warehousesApi.get(warehouseId),
          ordersApi.list({ warehouse_id: warehouseId }),
          inventoryApi.list({ warehouse_id: warehouseId }),
          analyticsApi.get({ warehouse_id: warehouseId }),
        ]);

        setWarehouse(warehouseRes);
        const ordersData = Array.isArray(ordersRes) ? ordersRes : (ordersRes as { data?: Order[] }).data || [];
        const inventoryData = Array.isArray(inventoryRes) ? inventoryRes : (inventoryRes as { data?: Inventory[] }).data || [];
        setOrders(ordersData);
        setInventory(inventoryData);
        setAnalytics(analyticsRes as any);
      } catch (error) {
        console.error('Failed to fetch warehouse data:', error);
      } finally {
        setLoading(false);
      }
    }
    if (user?.warehouse_id) fetchData();
  }, [user?.warehouse_id]);

  if (loading || !warehouse) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  const stats = [
    { name: 'Total Products', value: warehouse.total_products, icon: Package, change: '+12 this month', color: 'indigo' },
    { name: 'Total Orders', value: warehouse.total_orders, icon: ShoppingCart, change: '+45 today', color: 'emerald' },
    { name: 'Total Revenue', value: `${warehouse.total_sales.toLocaleString()} Br`, icon: DollarSign, change: '+8.2%', color: 'purple' },
    { name: 'Performance Score', value: `${warehouse.performance_score}%`, icon: TrendingUp, change: 'Excellent', color: 'amber' },
  ];

  const pendingOrders = orders.filter(o => ['pending', 'processing'].includes(o.status));
  const lowStockItems = inventory.filter(i => i.status === 'low_stock');
  const outOfStockItems = inventory.filter(i => i.status === 'out_of_stock');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-0.5">Welcome back, {warehouse.owner_name}</p>
        </div>
        <Link
          href="/warehouse/products/add"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-violet-700 transition-all shadow-sm hover:shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === 'indigo' ? 'bg-violet-50 text-violet-600' :
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                'bg-amber-50 text-amber-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 font-medium">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            <p className="text-xs text-emerald-600 mt-1.5 font-medium">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-amber-800 mb-4">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">Inventory Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outOfStockItems.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
                <p className="text-sm font-semibold text-red-600">{outOfStockItems.length} products out of stock</p>
                <p className="text-xs text-gray-500 mt-1">Restock immediately to avoid lost sales</p>
              </div>
            )}
            {lowStockItems.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
                <p className="text-sm font-semibold text-amber-600">{lowStockItems.length} products running low</p>
                <p className="text-xs text-gray-500 mt-1">Consider restocking soon</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/warehouse/orders" className="text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-5 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-violet-100 text-violet-600'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.total.toLocaleString()} Br</p>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium mt-1 ${
                    order.status === 'pending' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' : 'bg-violet-50 text-violet-700 ring-1 ring-violet-100'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {pendingOrders.length === 0 && (
              <div className="p-10 text-center text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium">No pending orders</p>
                <p className="text-sm text-gray-400 mt-1">All caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/warehouse/products/add"
              className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-violet-50 text-gray-700 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
                <Package className="w-5 h-5 text-violet-600" />
              </div>
              <span className="font-medium">Add New Product</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-violet-600" />
            </Link>
            <Link
              href="/warehouse/inventory"
              className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-emerald-50 text-gray-700 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <WarehouseIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="font-medium">Manage Inventory</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-emerald-600" />
            </Link>
            <Link
              href="/warehouse/orders"
              className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-purple-50 text-gray-700 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-medium">View Orders</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-purple-600" />
            </Link>
            <Link
              href="/warehouse/analytics"
              className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-amber-50 text-gray-700 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <span className="font-medium">View Analytics</span>
              <ChevronRight className="w-4 h-4 ml-auto text-gray-400 group-hover:text-amber-600" />
            </Link>
          </div>
        </div>
      </div>

      {/* Warehouse Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-5">Warehouse Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div>
            <p className="text-sm text-gray-500 font-medium">Warehouse Name</p>
            <p className="font-semibold text-gray-900 mt-1">{warehouse.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Business Type</p>
            <p className="font-semibold text-gray-900 mt-1">{warehouse.business_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Rating</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="font-semibold text-gray-900">{warehouse.rating.toFixed(1)}</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Member Since</p>
            <p className="font-semibold text-gray-900 mt-1">{new Date(warehouse.member_since).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Status</p>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
              warehouse.status === 'active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' :
              warehouse.status === 'pending_approval' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' :
              'bg-red-50 text-red-700 ring-1 ring-red-200'
            }`}>
              {warehouse.status.replace('_', ' ')}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Location</p>
            <p className="font-semibold text-gray-900 mt-1">{warehouse.city}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
