import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BulkPricingTier {
  minQty: number;
  maxQty: number | null;
  price: number;
}

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  image: string;
  retailPrice: number;
  bulkPricingTiers: BulkPricingTier[];
  qty: number;
  isBulkPriced: boolean;
  unitPrice: number; // actual price paid (retail or bulk)
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getVAT: () => number;
  getTotal: () => number;
  getBulkSavings: () => number;
  getItemCount: () => number;
}

export function getApplicableBulkPrice(
  tiers: BulkPricingTier[],
  qty: number
): number | null {
  for (const tier of tiers) {
    const withinMax = tier.maxQty === null || qty <= tier.maxQty;
    if (qty >= tier.minQty && withinMax) {
      return tier.price;
    }
  }
  return null;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const { items } = get();
        const existing = items.find((i) => i.id === newItem.id);
        if (existing) {
          const updatedQty = existing.qty + (newItem.qty ?? 1);
          set({
            items: items.map((i) =>
              i.id === newItem.id
                ? { ...i, qty: updatedQty, unitPrice: newItem.unitPrice }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...newItem, qty: newItem.qty ?? 1 }] });
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)),
        });
      },

      clearCart: () => set({ items: [] }),

      getSubtotal: () =>
        get().items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),

      getVAT: () => get().getSubtotal() * 0.15,

      getTotal: () => get().getSubtotal() * 1.15,

      getBulkSavings: () =>
        get().items.reduce((sum, i) => {
          if (i.isBulkPriced) {
            const saved = (i.retailPrice - i.unitPrice) * i.qty;
            return sum + (saved > 0 ? saved : 0);
          }
          return sum;
        }, 0),

      getItemCount: () =>
        get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: "smoke-time-cart" }
  )
);
