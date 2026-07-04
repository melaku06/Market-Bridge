import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { wishlistApi } from '@/lib/api';

export interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  image: string;
  basePrice: number;
  marginPercent: number;
  discountPercent: number;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  isInWishlist: (productId: string) => boolean;
  totalItems: () => number;

  toggleWishlist: (item: Omit<WishlistItem, 'id' | 'addedAt'>) => Promise<void>;
  addToWishlist: (customerId: string, item: Omit<WishlistItem, 'id' | 'addedAt'>) => Promise<void>;
  removeFromWishlist: (customerId: string, productId: string) => Promise<void>;
  clearWishlist: () => void;
  fetchWishlist: (customerId: string) => Promise<void>;
  clearError: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      isInitialized: false,

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },

      totalItems: () => get().items.length,

      toggleWishlist: async (item) => {
        const exists = get().isInWishlist(item.productId);
        if (exists) {
          set((state) => ({
            items: state.items.filter((i) => i.productId !== item.productId),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, id: `temp-${Date.now()}`, addedAt: new Date().toISOString() }],
          }));
        }
      },

      addToWishlist: async (customerId, item) => {
        if (get().isInWishlist(item.productId)) return;
        set({ isLoading: true, error: null });
        try {
          const response = await wishlistApi.add(customerId, item.productId);
          const newItem: WishlistItem = {
            id: response.id,
            productId: item.productId,
            name: item.name,
            image: item.image,
            basePrice: item.basePrice,
            marginPercent: item.marginPercent,
            discountPercent: item.discountPercent,
            addedAt: new Date().toISOString(),
          };
          set((state) => ({ items: [...state.items, newItem], isLoading: false }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to add to wishlist', isLoading: false });
        }
      },

      removeFromWishlist: async (customerId, productId) => {
        set({ isLoading: true, error: null });
        try {
          await wishlistApi.remove(customerId, productId);
          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
            isLoading: false,
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to remove from wishlist', isLoading: false });
        }
      },

      clearWishlist: () => set({ items: [] }),

      fetchWishlist: async (customerId: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await wishlistApi.list(customerId);
          const items: WishlistItem[] = response.map((item: any) => ({
            id: item.id,
            productId: item.product_id,
            name: item.product?.name || 'Unknown Product',
            image: item.product?.images?.[0] || '',
            basePrice: Number(item.product?.base_price || 0),
            marginPercent: Number(item.product?.margin_percent || 0),
            discountPercent: Number(item.product?.discount_percent || 0),
            addedAt: item.created_at,
          }));
          set({ items, isLoading: false, isInitialized: true });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch wishlist', isLoading: false, isInitialized: true });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
