'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, Edit2, Trash2, Home, Briefcase, MapPin, Info, CheckCircle, X, Save } from 'lucide-react';
import { addressesApi } from '@/lib/api';
import type { Address } from '@/lib/mock-db';

const LABEL_ICONS: Record<string, React.ReactNode> = {
  Home: <Home className="w-4 h-4" />,
  Office: <Briefcase className="w-4 h-4" />,
};

const CUSTOMER_ID = 'usr-001';

const EMPTY_FORM = { label: '', name: '', phone: '', address: '', city: '', country: 'Ethiopia' };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    setLoading(true);
    try {
      const res = await addressesApi.list(CUSTOMER_ID);
      const data = Array.isArray(res) ? res : (res as { data?: Address[] }).data || [];
      setAddresses(data);
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
    } finally {
      setLoading(false);
    }
  }

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (address: Address) => {
    setEditingId(address.id);
    setForm({
      label: address.label,
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      country: address.country,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.address) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await addressesApi.update(editingId, { ...form });
        setAddresses((prev) => prev.map((a) => (a.id === editingId ? (updated as unknown as Address) ?? { ...a, ...form } : a)));
      } else {
        const res = await addressesApi.create({
          customer_id: CUSTOMER_ID,
          ...form,
          is_default: addresses.length === 0,
        });
        await fetchAddresses();
        void res;
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to save address:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await addressesApi.delete(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Failed to delete address:', error);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressesApi.setDefault(id, CUSTOMER_ID);
      setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === id })));
    } catch (error) {
      console.error('Failed to set default:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <Link href="/dashboard" className="hover:text-blue-600">Dashboard</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Saved Addresses</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Saved Addresses</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>
        <p className="text-sm text-gray-500">Manage your delivery addresses.</p>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Label', placeholder: 'e.g. Home, Office', key: 'label' },
              { label: 'Full Name', placeholder: 'Enter full name', key: 'name' },
              { label: 'Phone Number', placeholder: 'e.g. +251 91 234 5678', key: 'phone' },
              { label: 'Street Address', placeholder: 'Sub-city, woreda, house number', key: 'address' },
              { label: 'City', placeholder: 'e.g. Addis Ababa', key: 'city' },
              { label: 'Country', placeholder: 'Country', key: 'country' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={(form as Record<string, string>)[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {saving
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Save className="w-4 h-4" />
              }
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No saved addresses yet.</p>
          <button onClick={openAdd} className="text-blue-600 hover:underline text-sm font-medium">
            Add your first address
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-xl border p-5 transition-colors ${address.is_default ? 'border-blue-200 bg-blue-50/20' : 'border-gray-100'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${address.is_default ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {LABEL_ICONS[address.label] || <MapPin className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-gray-900">{address.label}</p>
                      {address.is_default && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{address.name}</p>
                    <p className="text-sm text-gray-500">{address.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                    <p className="text-sm text-gray-600">{address.city}, {address.country}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(address)}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 hover:text-blue-600"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  {!address.is_default && (
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors text-gray-500 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              {!address.is_default && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 flex items-center gap-1">
        <Info className="w-3.5 h-3.5" />
        Your default address is used automatically at checkout.
      </p>
    </div>
  );
}
