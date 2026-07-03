import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface WishlistItem {
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

  isInWishlist: (productId: string) => boolean;
  totalItems: () => number;

  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  fetchWishlist: (_customerId?: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      isInWishlist: (productId: string) => {
        return get().items.some((item) => item.productId === productId);
      },

      totalItems: () => get().items.length,

      toggleWishlist: (item) => {
        const exists = get().isInWishlist(item.productId);
        if (exists) {
          set((state) => ({
            items: state.items.filter((i) => i.productId !== item.productId),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, addedAt: new Date().toISOString() }],
          }));
        }
      },

      addToWishlist: (item) => {
        if (get().isInWishlist(item.productId)) return;
        set((state) => ({
          items: [...state.items, { ...item, addedAt: new Date().toISOString() }],
        }));
      },

      removeFromWishlist: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      clearWishlist: () => set({ items: [] }),

      fetchWishlist: async () => {
        // Items are already loaded from localStorage by persist middleware
        set({ isLoading: false });
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
