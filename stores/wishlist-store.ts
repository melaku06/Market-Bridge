import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { wishlistApi } from '@/lib/api';
import type { Product, WishlistItem } from '@/lib/mock-db';

interface WishlistItemWithProduct extends WishlistItem {
  product: Product | null;
}

interface WishlistState {
  items: WishlistItemWithProduct[];
  isLoading: boolean;
  error: string | null;

  // Computed
  isInWishlist: (productId: string) => boolean;
  totalItems: () => number;

  // Actions
  fetchWishlist: (customerId: string) => Promise<void>;
  addToWishlist: (customerId: string, productId: string) => Promise<boolean>;
  removeFromWishlist: (customerId: string, productId: string) => Promise<boolean>;
  clearWishlist: () => void;
  clearError: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.product_id === productId);
      },

      totalItems: () => get().items.length,

      fetchWishlist: async (customerId: string) => {
        set({ isLoading: true, error: null });
        try {
          const items = await wishlistApi.list(customerId);
          set({ items: items as WishlistItemWithProduct[], isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch wishlist',
            isLoading: false,
          });
        }
      },

      addToWishlist: async (customerId: string, productId: string) => {
        set({ isLoading: true, error: null });
        try {
          const item = await wishlistApi.add(customerId, productId);
          set((state) => ({
            items: [...state.items, item as WishlistItemWithProduct],
            isLoading: false,
          }));
          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add to wishlist',
            isLoading: false,
          });
          return false;
        }
      },

      removeFromWishlist: async (customerId: string, productId: string) => {
        set({ isLoading: true, error: null });
        try {
          await wishlistApi.remove(customerId, productId);
          set((state) => ({
            items: state.items.filter((item) => item.product_id !== productId),
            isLoading: false,
          }));
          return true;
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to remove from wishlist',
            isLoading: false,
          });
          return false;
        }
      },

      clearWishlist: () => set({ items: [] }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
