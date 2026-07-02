'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, Edit2, Trash2, Home, Briefcase, MapPin } from 'lucide-react';
import { addresses as initialAddresses } from '@/lib/data';

export default function AddressesPage() {
  const [addressList, setAddressList] = useState(initialAddresses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ label: '', name: '', phone: '', address: '', city: '', country: 'United States' });

  const handleDelete = (id: string) => setAddressList(addressList.filter((a) => a.id !== id));
  const setDefault = (id: string) => setAddressList(addressList.map((a) => ({ ...a, isDefault: a.id === id })));

  const iconMap: Record<string, React.ReactNode> = {
    Home: <Home className="w-4 h-4" />,
    Office: <Briefcase className="w-4 h-4" />,
  };

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
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>
        <p className="text-sm text-gray-500">Manage your shipping addresses.</p>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Add New Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Label', placeholder: 'e.g. Home, Office', key: 'label' },
              { label: 'Full Name', placeholder: 'Enter full name', key: 'name' },
              { label: 'Phone Number', placeholder: 'Enter phone number', key: 'phone' },
              { label: 'Street Address', placeholder: 'Enter street address', key: 'address' },
              { label: 'City, State, ZIP', placeholder: 'e.g. Los Angeles, CA 90001', key: 'city' },
              { label: 'Country', placeholder: 'Country', key: 'country' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={(form as any)[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => {
                if (form.name && form.address) {
                  setAddressList([...addressList, { id: String(Date.now()), ...form, isDefault: false, type: 'shipping' }]);
                  setShowForm(false);
                  setForm({ label: '', name: '', phone: '', address: '', city: '', country: 'United States' });
                }
              }}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Save Address
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="space-y-4">
        {addressList.map((address) => (
          <div key={address.id} className={`bg-white rounded-xl border p-5 ${address.isDefault ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${address.isDefault ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {iconMap[address.label] || <MapPin className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900">{address.label}</p>
                    {address.isDefault && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-medium">Default</span>
                    )}
                    {address.type === 'shipping' && !address.isDefault && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Shipping</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{address.name}</p>
                  <p className="text-sm text-gray-500">{address.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                  <p className="text-sm text-gray-600">{address.city}</p>
                  <p className="text-sm text-gray-600">{address.country}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-700">
                  <Edit2 className="w-4 h-4" />
                </button>
                {!address.isDefault && (
                  <button onClick={() => handleDelete(address.id)} className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors text-gray-500 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {!address.isDefault && (
              <button
                onClick={() => setDefault(address.id)}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Set as Default
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 flex items-center gap-1">
        <span>ℹ️</span>
        Set a default address to make checkout faster.
      </p>
    </div>
  );
}
