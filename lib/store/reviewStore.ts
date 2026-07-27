import { create } from "zustand";
import { ReviewItem } from "@/lib/types";

interface ReviewStore {
  reviews: ReviewItem[];
  getReviews: (productId: string) => ReviewItem[];
  addReview: (review: Omit<ReviewItem, "id" | "date">) => void;
}

const seedReviews: ReviewItem[] = [
  { id: "r1", productId: "1", author: "David M.", rating: 5, comment: "Exceptional quality Virginia blend. Smooth draw with rich caramel tones.", date: "2024-10-12" },
  { id: "r2", productId: "1", author: "Johan K.", rating: 4, comment: "Great moisture level straight out of the tin. Will reorder.", date: "2024-09-28" },
  { id: "r3", productId: "2", author: "Sipho D.", rating: 5, comment: "Massive clouds and top-tier mint flavor. Huge hit with our lounge customers.", date: "2024-10-01" },
  { id: "r4", productId: "3", author: "Francois B.", rating: 5, comment: "Smooth creamy smoke. Perfect with a 12-year single malt.", date: "2024-08-15" },
];

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
