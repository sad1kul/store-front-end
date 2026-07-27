import { create } from "zustand";
import { getContentApi, updateContentApi, ContentData } from "@/lib/api/content";

interface ContentStore extends ContentData {
  isLoading: boolean;
  error: string | null;
  fetchContent: () => Promise<void>;
  setHeroHeading: (v: string) => Promise<void>;
  setHeroSubtext: (v: string) => Promise<void>;
  setPromoBannerText: (v: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
  reset: () => Promise<void>;
}

const initialDefaults: ContentData = {
  heroHeading: "South Africa's Premium Smoke Store",
  heroSubtext: "Shop the finest tobacco, shisha, cigars, and vaping products. Competitive pricing for both retail and wholesale buyers.",
  promoBannerText: "Save More with Bulk Pricing",
  featuredProductIds: ["1", "2", "3", "4", "7", "8"],
};

export const useContentStore = create<ContentStore>()((set, get) => ({
  ...initialDefaults,
  isLoading: false,
  error: null,

  fetchContent: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await getContentApi();
      if (res.success && res.data?.content) {
        set({ ...res.data.content, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || "Failed to load content", isLoading: false });
    }
  },

  setHeroHeading: async (v) => {
    set({ heroHeading: v });
    try {
      await updateContentApi({ heroHeading: v });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  setHeroSubtext: async (v) => {
    set({ heroSubtext: v });
    try {
      await updateContentApi({ heroSubtext: v });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  setPromoBannerText: async (v) => {
    set({ promoBannerText: v });
    try {
      await updateContentApi({ promoBannerText: v });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  toggleFeatured: async (id) => {
    const current = get().featuredProductIds;
    const updated = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];

    set({ featuredProductIds: updated });
    try {
      await updateContentApi({ featuredProductIds: updated });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  reset: async () => {
    set(initialDefaults);
    try {
      await updateContentApi(initialDefaults);
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
