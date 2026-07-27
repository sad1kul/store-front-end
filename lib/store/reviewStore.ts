import { create } from "zustand";
import { allProducts } from "@/lib/mock-data";
import { ReviewItem } from "@/lib/types";

interface ReviewStore {
  reviews: ReviewItem[];
  getReviews: (productId: string) => ReviewItem[];
  addReview: (review: Omit<ReviewItem, "id" | "date">) => void;
}

// seed from mock data
const seedReviews: ReviewItem[] = allProducts.flatMap((p) =>
  (p.reviews ?? []).map((r) => ({ ...r, productId: p.id }))
);

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: seedReviews,

  getReviews(productId) {
    return get().reviews.filter((r) => r.productId === productId);
  },

  addReview(data) {
    const review: ReviewItem = {
      ...data,
      id: `r-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    };
    set((s) => ({ reviews: [...s.reviews, review] }));
  },
}));
