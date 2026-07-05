'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, Edit2, Trash2, MapPin, CheckCircle, X, Save, Info, Home, Briefcase, MapPinned } from 'lucide-react';
import { useAddressesStore } from '@/stores';
import type { Address } from '@/lib/types';

const labelIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('home')) return <Home className="w-4 h-4" />;
  if (l.includes('office') || l.includes('work')) return <Briefcase className="w-4 h-4" />;
  return <MapPinned className="w-4 h-4" />;
};

const CUSTOMER_ID = 'usr-001';
const EMPTY_FORM = { label: '', recipient_name: '', phone: '', address: '', city: '', country: 'Ethiopia' };

export default function AddressesPage() {
  const { addresses, isLoading, fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddressesStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAddresses(CUSTOMER_ID);
  }, [fetchAddresses]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (address: Address) => {
    setEditingId(address.id);
    setForm({
      label: address.label,
      recipient_name: address.recipient_name,
      phone: address.phone || '',
      address: address.address,
      city: address.city,
      country: address.country,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.recipient_name || !form.address) return;
    setSaving(true);
    try {
      if (editingId) {
        await updateAddress(editingId, form);
      } else {
        await addAddress({
          customer_id: CUSTOMER_ID,
          ...form,
          is_default: addresses.length === 0,
        });
      }
      setShowForm(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      await deleteAddress(id);
    }
  };

  const handleSetDefault = async (id: string) => {
    await setDefaultAddress(id, CUSTOMER_ID);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb + Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[12px] text-gray-400 mb-1">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <ChevronRight style={{ width: 12, height: 12 }} />
            <span className="text-gray-700 font-medium">Saved Addresses</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">Saved Addresses</h1>
          <p className="text-[13px] text-gray-500 mt-0.5">Manage your delivery addresses for faster checkout.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus style={{ width: 14, height: 14 }} />
          <span className="hidden sm:inline">Add New Address</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-bold text-gray-900">{editingId ? 'Edit Address' : 'Add New Address'}</h2>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <X style={{ width: 16, height: 16 }} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Label', placeholder: 'e.g. Home, Office, Work', key: 'label' },
              { label: 'Full Name', placeholder: 'Enter full name', key: 'recipient_name' },
              { label: 'Phone Number', placeholder: 'e.g. +251 91 234 5678', key: 'phone' },
              { label: 'Street Address', placeholder: 'Sub-city, woreda, house number', key: 'address' },
              { label: 'City', placeholder: 'e.g. Addis Ababa', key: 'city' },
              { label: 'Country', placeholder: 'Country', key: 'country' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-[12px] font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={(form as Record<string, string>)[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[13px] focus:border-blue-500 focus:outline-none transition-all bg-gray-50 focus:bg-white"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {saving && <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {!saving && <Save style={{ width: 14, height: 14 }} />}
              {editingId ? 'Update Address' : 'Save Address'}
            </button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition-colors text-gray-700">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <MapPin style={{ width: 24, height: 24 }} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-900 mb-1">No saved addresses yet.</p>
          <p className="text-[13px] text-gray-500 mb-4">Add an address to speed up your checkout.</p>
          <button onClick={openAdd} className="text-blue-600 hover:underline text-[13px] font-semibold">
            Add your first address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-xl border overflow-hidden transition-all hover:shadow-sm ${
                address.is_default ? 'border-blue-500' : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${address.is_default ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                      {labelIcon(address.label || 'Address')}
                    </div>
                    <div>
                      <h3 className="text-[13px] font-bold text-gray-900">{address.label || 'Address'}</h3>
                      {address.is_default && (
                        <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">Default</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => openEdit(address)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 style={{ width: 14, height: 14 }} />
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 style={{ width: 14, height: 14 }} />
                    </button>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[13px] font-semibold text-gray-900">{address.recipient_name}</p>
                  <p className="text-[12px] text-gray-600">{address.address}</p>
                  <p className="text-[12px] text-gray-600">{address.city}, {address.country}</p>
                  <p className="text-[12px] text-gray-500 mt-1">Phone: {address.phone}</p>
                </div>

                {address.is_default ? (
                  <div className="flex items-center gap-1.5 mt-3 text-emerald-600">
                    <CheckCircle style={{ width: 14, height: 14 }} />
                    <span className="text-[11px] font-semibold">Default Address</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-3 px-3 py-1.5 border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info style={{ width: 14, height: 14 }} className="text-blue-500" />
          <h3 className="text-[13px] font-bold text-gray-900">Address Tips</h3>
        </div>
        <div className="space-y-2">
          {[
            'Ensure your address is accurate for smooth delivery',
            'Include apartment, suite, or floor details if applicable',
            'Provide a valid phone number for delivery updates',
          ].map((tip) => (
            <div key={tip} className="flex items-center gap-2">
              <CheckCircle style={{ width: 14, height: 14 }} className="text-emerald-500 flex-shrink-0" />
              <p className="text-[12px] text-gray-600">{tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
