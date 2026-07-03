'use client';

import { useEffect, useState } from 'react';
import { Package, ShoppingCart, DollarSign, TrendingUp, AlertTriangle, Clock, Warehouse as WarehouseIcon, Star } from 'lucide-react';
import Link from 'next/link';
import { warehousesApi, ordersApi, inventoryApi, analyticsApi } from '@/lib/api';
import type { Warehouse, Order, Inventory } from '@/lib/mock-db';

export default function WarehouseDashboard() {
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [analytics, setAnalytics] = useState<{ revenue: { today: number; week: number; month: number; total: number }; orders: { total: number; active: number; completed: number; cancelled: number } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Simulate logged-in warehouse ID
        const warehouseId = 'wh-001';

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
        setAnalytics(analyticsRes);
      } catch (error) {
        console.error('Failed to fetch warehouse data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading || !warehouse) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    { name: 'Total Products', value: warehouse.total_products, icon: Package, change: '+12 this month', color: 'blue' },
    { name: 'Total Orders', value: warehouse.total_orders, icon: ShoppingCart, change: '+45 today', color: 'green' },
    { name: 'Total Revenue', value: `${warehouse.total_sales.toLocaleString()} Br`, icon: DollarSign, change: '+8.2%', color: 'purple' },
    { name: 'Performance Score', value: `${warehouse.performance_score}%`, icon: TrendingUp, change: 'Excellent', color: 'orange' },
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
          <p className="text-gray-500">Welcome back, {warehouse.owner_name}</p>
        </div>
        <Link
          href="/warehouse/products/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Add New Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                stat.color === 'green' ? 'bg-green-50 text-green-600' :
                stat.color === 'purple' ? 'bg-purple-50 text-purple-600' :
                'bg-orange-50 text-orange-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm text-gray-500">{stat.name}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-green-600 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStockItems.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-amber-800 mb-3">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">Inventory Alerts</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outOfStockItems.length > 0 && (
              <div className="bg-white rounded-lg p-3 border border-red-200">
                <p className="text-sm font-medium text-red-600">{outOfStockItems.length} products out of stock</p>
                <p className="text-xs text-gray-500 mt-1">Restock immediately to avoid lost sales</p>
              </div>
            )}
            {lowStockItems.length > 0 && (
              <div className="bg-white rounded-lg p-3 border border-amber-200">
                <p className="text-sm font-medium text-amber-600">{lowStockItems.length} products running low</p>
                <p className="text-xs text-gray-500 mt-1">Consider restocking soon</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/warehouse/orders" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-100">
            {pendingOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{order.customer_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{order.total.toLocaleString()} Br</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {pendingOrders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No pending orders
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/warehouse/products/add"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <Package className="w-5 h-5 text-blue-600" />
              Add New Product
            </Link>
            <Link
              href="/warehouse/inventory"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <WarehouseIcon className="w-5 h-5 text-green-600" />
              Manage Inventory
            </Link>
            <Link
              href="/warehouse/orders"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5 text-purple-600" />
              View Orders
            </Link>
            <Link
              href="/warehouse/analytics"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
            >
              <TrendingUp className="w-5 h-5 text-orange-600" />
              View Analytics
            </Link>
          </div>
        </div>
      </div>

      {/* Warehouse Info Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Warehouse Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500">Warehouse Name</p>
            <p className="font-medium text-gray-900">{warehouse.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Business Type</p>
            <p className="font-medium text-gray-900">{warehouse.business_type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rating</p>
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-900">{warehouse.rating}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-medium text-gray-900">{new Date(warehouse.member_since).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              warehouse.status === 'active' ? 'bg-green-100 text-green-700' :
              warehouse.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {warehouse.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium text-gray-900">{warehouse.city}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
