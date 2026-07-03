import { create } from 'zustand';
import { addressesApi } from '@/lib/api';
import type { Address } from '@/lib/mock-db';

interface AddressesState {
  addresses: Address[];
  defaultAddress: Address | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchAddresses: (customerId: string) => Promise<void>;
  addAddress: (data: Partial<Address>) => Promise<Address | null>;
  updateAddress: (id: string, data: Partial<Address>) => Promise<boolean>;
  deleteAddress: (id: string) => Promise<boolean>;
  setDefaultAddress: (id: string, customerId: string) => Promise<boolean>;
  clearError: () => void;
}

export const useAddressesStore = create<AddressesState>()((set, get) => ({
  addresses: [],
  defaultAddress: null,
  isLoading: false,
  error: null,

  fetchAddresses: async (customerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await addressesApi.list(customerId);
      const addressList = response.data || [];
      const defaultAddress = addressList.find((a) => a.is_default) || addressList[0] || null;

      set({
        addresses: addressList,
        defaultAddress,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch addresses',
        isLoading: false,
      });
    }
  },

  addAddress: async (data: Partial<Address>) => {
    set({ isLoading: true, error: null });
    try {
      const address = await addressesApi.create(data);
      set((state) => {
        const newAddresses = [...state.addresses, address];
        const defaultAddress = address.is_default
          ? address
          : state.defaultAddress;

        // If this is set as default, update other addresses
        if (address.is_default) {
          newAddresses.forEach((a) => {
            if (a.id !== address.id) a.is_default = false;
          });
        }

        return {
          addresses: newAddresses,
          defaultAddress,
          isLoading: false,
        };
      });
      return address;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add address',
        isLoading: false,
      });
      return null;
    }
  },

  updateAddress: async (id: string, data: Partial<Address>) => {
    set({ isLoading: true, error: null });
    try {
      const address = await addressesApi.update(id, data);
      set((state) => {
        const newAddresses = state.addresses.map((a) =>
          a.id === id ? address : a
        );

        // If this is set as default, update other addresses
        if (address.is_default) {
          newAddresses.forEach((a) => {
            if (a.id !== id) a.is_default = false;
          });
        }

        const defaultAddress = newAddresses.find((a) => a.is_default) || newAddresses[0] || null;

        return {
          addresses: newAddresses,
          defaultAddress,
          isLoading: false,
        };
      });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update address',
        isLoading: false,
      });
      return false;
    }
  },

  deleteAddress: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await addressesApi.delete(id);
      set((state) => {
        const newAddresses = state.addresses.filter((a) => a.id !== id);
        const defaultAddress = state.defaultAddress?.id === id
          ? newAddresses.find((a) => a.is_default) || newAddresses[0] || null
          : state.defaultAddress;

        return {
          addresses: newAddresses,
          defaultAddress,
          isLoading: false,
        };
      });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete address',
        isLoading: false,
      });
      return false;
    }
  },

  setDefaultAddress: async (id: string, customerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const address = await addressesApi.setDefault(id, customerId);
      set((state) => {
        const newAddresses = state.addresses.map((a) => ({
          ...a,
          is_default: a.id === id,
        }));

        return {
          addresses: newAddresses,
          defaultAddress: address,
          isLoading: false,
        };
      });
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to set default address',
        isLoading: false,
      });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
