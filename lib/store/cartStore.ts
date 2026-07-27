import { create } from "zustand";
import { persist } from "zustand/middleware";
import { validateCartApi, ValidatedCart } from "@/lib/api/cart";
import { BulkPricingTier } from "@/lib/types";

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  image: string;
  retailPrice: number;
  bulkPricingTiers: BulkPricingTier[];
  qty: number;
  isBulkPriced?: boolean;
  unitPrice?: number;
}

export function getApplicableBulkPrice(tiers: BulkPricingTier[] = [], qty: number): number | null {
  for (const tier of tiers) {
    const withinMax = tier.maxQty === null || qty <= tier.maxQty;
    if (qty >= tier.minQty && withinMax) {
      return tier.price;
    }
  }
  return null;
}

interface CartState {
  items: CartItem[];
  serverValidatedCart: ValidatedCart | null;
  isValidating: boolean;
  validationError: string | null;
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  validateWithServer: () => Promise<ValidatedCart | null>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      serverValidatedCart: null,
      isValidating: false,
      validationError: null,

      addItem: (newItem) => {
        const { items } = get();
        const existing = items.find((i) => i.id === newItem.id);
        if (existing) {
          const updatedQty = existing.qty + (newItem.qty ?? 1);
          set({
            items: items.map((i) =>
              i.id === newItem.id ? { ...i, qty: updatedQty } : i
            ),
            serverValidatedCart: null, // Reset validation when cart changes
          });
        } else {
          set({
            items: [...items, { ...newItem, qty: newItem.qty ?? 1 }],
            serverValidatedCart: null,
          });
        }
      },

      removeItem: (id) =>
        set({
          items: get().items.filter((i) => i.id !== id),
          serverValidatedCart: null,
        }),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, qty } : item
          ),
          serverValidatedCart: null,
        });
      },

      clearCart: () => set({ items: [], serverValidatedCart: null }),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),

      validateWithServer: async () => {
        const { items } = get();
        if (items.length === 0) {
          set({ serverValidatedCart: null, isValidating: false });
          return null;
        }

        set({ isValidating: true, validationError: null });

        try {
          const payload = items.map((i) => ({ productId: i.id, qty: i.qty }));
          const res = await validateCartApi(payload);

          if (res.success && res.data) {
            set({ serverValidatedCart: res.data, isValidating: false });
            return res.data;
          } else {
            set({ validationError: "Failed to validate cart", isValidating: false });
            return null;
          }
        } catch (err: any) {
          set({
            validationError: err.message || "Cart validation error",
            isValidating: false,
          });
          return null;
        }
      },
    }),
    {
      name: "smoke-time-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
