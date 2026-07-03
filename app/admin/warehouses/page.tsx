'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Check, X, Warehouse as WarehouseIcon, Star } from 'lucide-react';
import { warehousesApi } from '@/lib/api';
import type { WarehouseStatus, Warehouse } from '@/lib/mock-db';

const statusLabels: Record<string, string> = {
  all: 'All',
  pending_approval: 'Pending',
  active: 'Active',
  suspended: 'Suspended',
  deactivated: 'Deactivated',
};

const statusColors: Record<string, string> = {
  pending_approval: 'bg-yellow-100 text-yellow-700',
  active: 'bg-green-100 text-green-700',
  suspended: 'bg-red-100 text-red-700',
  deactivated: 'bg-gray-100 text-gray-700',
};

export default function AdminWarehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<WarehouseStatus | 'all'>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await warehousesApi.list({});
        const warehousesData = Array.isArray(res) ? res : (res as { data?: Warehouse[] }).data || [];
        setWarehouses(warehousesData);
      } catch (error) {
        console.error('Failed to fetch warehouses:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  let filteredWarehouses = warehouses;
  if (statusFilter !== 'all') {
    filteredWarehouses = filteredWarehouses.filter(w => w.status === statusFilter);
  }
  if (searchQuery) {
    filteredWarehouses = filteredWarehouses.filter(w =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.business_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const statusCounts = {
    all: warehouses.length,
    pending_approval: warehouses.filter(w => w.status === 'pending_approval').length,
    active: warehouses.filter(w => w.status === 'active').length,
    suspended: warehouses.filter(w => w.status === 'suspended').length,
    deactivated: warehouses.filter(w => w.status === 'deactivated').length,
  };

  const handleApprove = async (warehouseId: string) => {
    try {
      await warehousesApi.update(warehouseId, { status: 'active' });
      setWarehouses(prev => prev.map(w => w.id === warehouseId ? { ...w, status: 'active' as const } : w));
      setSelectedWarehouse(null);
    } catch (error) {
      console.error('Failed to approve warehouse:', error);
    }
  };

  const handleSuspend = async (warehouseId: string) => {
    try {
      await warehousesApi.update(warehouseId, { status: 'suspended' });
      setWarehouses(prev => prev.map(w => w.id === warehouseId ? { ...w, status: 'suspended' as const } : w));
      setSelectedWarehouse(null);
    } catch (error) {
      console.error('Failed to suspend warehouse:', error);
    }
  };

  const selectedWarehouseData = warehouses.find(w => w.id === selectedWarehouse);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Warehouse Management</h1>
        <p className="text-gray-500">Manage and approve warehouse applications</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search warehouses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending_approval', 'active', 'suspended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {statusLabels[status]}
              <span className="ml-1 text-xs opacity-70">({statusCounts[status]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Warehouses Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Warehouse</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Business Type</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Products</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredWarehouses.map((warehouse) => (
              <tr key={warehouse.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <WarehouseIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{warehouse.name}</p>
                      <p className="text-xs text-gray-500">{warehouse.owner_name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{warehouse.business_type}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-gray-900">{warehouse.rating}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{warehouse.total_products}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[warehouse.status]}`}>
                    {statusLabels[warehouse.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedWarehouse(warehouse.id)}
                      className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {warehouse.status === 'pending_approval' && (
                      <button
                        onClick={() => handleApprove(warehouse.id)}
                        className="p-1 rounded hover:bg-green-50 text-green-600"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {warehouse.status === 'active' && (
                      <button
                        onClick={() => handleSuspend(warehouse.id)}
                        className="p-1 rounded hover:bg-red-50 text-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredWarehouses.length === 0 && (
          <div className="p-12 text-center">
            <WarehouseIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No warehouses found</p>
          </div>
        )}
      </div>

      {/* Warehouse Detail Modal */}
      {selectedWarehouseData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedWarehouse(null)}>
          <div className="bg-white rounded-2xl max-w-xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <WarehouseIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">{selectedWarehouseData.name}</h2>
                    <p className="text-sm text-gray-500">{selectedWarehouseData.owner_name}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedWarehouse(null)} className="p-1 rounded hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedWarehouseData.status]}`}>
                {statusLabels[selectedWarehouseData.status]}
              </span>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{selectedWarehouseData.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{selectedWarehouseData.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">{selectedWarehouseData.city}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Business Type</p>
                  <p className="font-medium text-gray-900">{selectedWarehouseData.business_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Products</p>
                  <p className="font-medium text-gray-900">{selectedWarehouseData.total_products}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Orders</p>
                  <p className="font-medium text-gray-900">{selectedWarehouseData.total_orders}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Sales</p>
                  <p className="font-medium text-gray-900">{selectedWarehouseData.total_sales.toLocaleString()} Br</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Performance</p>
                  <p className="font-medium text-gray-900">{selectedWarehouseData.performance_score}%</p>
                </div>
              </div>

              {selectedWarehouseData.status === 'pending_approval' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleApprove(selectedWarehouseData.id)}
                    className="flex-1 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
                  >
                    Approve Warehouse
                  </button>
                  <button
                    onClick={() => handleSuspend(selectedWarehouseData.id)}
                    className="flex-1 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
                  >
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
