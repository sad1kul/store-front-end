import { create } from "zustand";
import productsData from "@/lib/mock-data/products.json";

interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewStore {
  reviews: Review[];
  getReviews: (productId: string) => Review[];
  addReview: (review: Omit<Review, "id" | "date">) => void;
}

// seed from mock data
const seedReviews: Review[] = (productsData as any[]).flatMap((p) =>
  (p.reviews ?? []).map((r: any) => ({ ...r, productId: p.id }))
);

export const useReviewStore = create<ReviewStore>((set, get) => ({
  reviews: seedReviews,

  getReviews(productId) {
    return get().reviews.filter((r) => r.productId === productId);
  },

  addReview(data) {
    const review: Review = {
      ...data,
      id: `r-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
    };
    set((s) => ({ reviews: [...s.reviews, review] }));
  },
}));
