'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Ban, Users, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import { usersApi, analyticsApi } from '@/lib/api';
import type { User } from '@/lib/mock-db';

type UserWithoutPassword = Omit<User, 'password_hash'>;

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<UserWithoutPassword[]>([]);
  const [analytics, setAnalytics] = useState<{ customers: { new_this_month: number } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'banned'>('all');

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes, analyticsRes] = await Promise.all([
          usersApi.list({ role: 'customer' }),
          analyticsApi.get({}),
        ]);
        const usersData = Array.isArray(usersRes) ? usersRes : (usersRes as { data?: UserWithoutPassword[] }).data || [];
        setCustomers(usersData);
        setAnalytics(analyticsRes);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  let filteredCustomers = customers;
  if (statusFilter !== 'all') {
    filteredCustomers = filteredCustomers.filter(u => u.status === statusFilter);
  }
  if (searchQuery) {
    filteredCustomers = filteredCustomers.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const statusCounts: Record<string, number> = {
    all: customers.length,
    active: customers.filter(u => u.status === 'active').length,
    suspended: customers.filter(u => u.status === 'suspended').length,
    banned: customers.filter(u => u.status === 'banned').length,
  };

  const toggleStatus = async (userId: string) => {
    const customer = customers.find(u => u.id === userId);
    if (!customer) return;

    const newStatus = customer.status === 'active' ? 'banned' : 'active';
    try {
      await usersApi.update(userId, { status: newStatus });
      setCustomers(prev =>
        prev.map(u => u.id === userId ? { ...u, status: newStatus as 'active' | 'suspended' | 'banned' } : u)
      );
    } catch (error) {
      console.error('Failed to toggle customer status:', error);
    }
  };

  if (loading || !analytics) {
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
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-500">View and manage customer accounts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{statusCounts.all}</p>
          <p className="text-sm text-gray-500">Total Customers</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
          <p className="text-sm text-gray-500">Active</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <UserX className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-red-600">{statusCounts.banned}</p>
          <p className="text-sm text-gray-500">Blocked</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-pink-600">{analytics.customers.new_this_month.toLocaleString()}</p>
          <p className="text-sm text-gray-500">New This Month</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'banned'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1 text-xs opacity-70">({statusCounts[status]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Registered</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {customer.avatar ? (
                      <img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-bold text-gray-500">{customer.name.charAt(0)}</span>
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{customer.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Mail className="w-3 h-3" />
                    {customer.email}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Phone className="w-3 h-3" />
                    {customer.phone}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(customer.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    customer.status === 'active' ? 'bg-green-100 text-green-700' :
                    customer.status === 'banned' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleStatus(customer.id)}
                      className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
