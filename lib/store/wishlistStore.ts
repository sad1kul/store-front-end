import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  ids: string[];
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],

      toggle(productId) {
        const current = get().ids;
        if (current.includes(productId)) {
          set({ ids: current.filter((id) => id !== productId) });
        } else {
          set({ ids: [...current, productId] });
        }
      },

      isWishlisted(productId) {
        return get().ids.includes(productId);
      },

      clear() {
        set({ ids: [] });
      },
    }),
    { name: "sts_wishlist" }
  )
);
