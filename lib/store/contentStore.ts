import { create } from "zustand";
import { persist } from "zustand/middleware";
import productsData from "@/lib/mock-data/products.json";

const defaultFeaturedIds = (productsData as any[])
  .filter((p) => p.featured)
  .map((p) => p.id);

interface ContentStore {
  heroHeading: string;
  heroSubtext: string;
  promoBannerText: string;
  featuredProductIds: string[];
  setHeroHeading: (v: string) => void;
  setHeroSubtext: (v: string) => void;
  setPromoBannerText: (v: string) => void;
  toggleFeatured: (id: string) => void;
  reset: () => void;
}

const defaults = {
  heroHeading: "South Africa's Premium Smoke Store",
  heroSubtext: "Shop the finest tobacco, shisha, cigars, and vaping products. Competitive pricing for both retail and wholesale buyers.",
  promoBannerText: "Save More with Bulk Pricing",
  featuredProductIds: defaultFeaturedIds,
};

export const useContentStore = create<ContentStore>()(
  persist(
    (set) => ({
      ...defaults,

      setHeroHeading: (v) => set({ heroHeading: v }),
      setHeroSubtext: (v) => set({ heroSubtext: v }),
      setPromoBannerText: (v) => set({ promoBannerText: v }),

      toggleFeatured(id) {
        set((s) => ({
          featuredProductIds: s.featuredProductIds.includes(id)
            ? s.featuredProductIds.filter((x) => x !== id)
            : [...s.featuredProductIds, id],
        }));
      },

      reset: () => set(defaults),
    }),
    { name: "sts_content" }
  )
);
