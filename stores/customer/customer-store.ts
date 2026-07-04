import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/lib/types';

interface CustomerState {
  recentlyViewed: Product[];
  profileForm: {
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  isSaving: boolean;
  isSaved: boolean;

  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
  setProfileForm: (form: { name: string; email: string; phone: string; avatar: string }) => void;
  setSaving: (saving: boolean) => void;
  setSaved: (saved: boolean) => void;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      recentlyViewed: [],
      profileForm: { name: '', email: '', phone: '', avatar: '' },
      isSaving: false,
      isSaved: false,

      addToRecentlyViewed: (product) => {
        set((s) => {
          const filtered = s.recentlyViewed.filter((p) => p.id !== product.id);
          return { recentlyViewed: [product, ...filtered].slice(0, 20) };
        });
      },

      clearRecentlyViewed: () => set({ recentlyViewed: [] }),

      setProfileForm: (profileForm) => set({ profileForm }),
      setSaving: (isSaving) => set({ isSaving }),
      setSaved: (isSaved) => set({ isSaved }),
    }),
    {
      name: 'customer-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ recentlyViewed: state.recentlyViewed }),
    }
  )
);
