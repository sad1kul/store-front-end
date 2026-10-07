export interface BulkPricingTier {
  minQty: number;
  maxQty: number | null;
  price: number;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  description: string;
  retailPrice: number;
  bulkPricingTiers: BulkPricingTier[];
  stock: number;
  moq?: number;
  images: string[];
  featured?: boolean;
  status?: "draft" | "active" | "inactive";
  tags?: string[];
  reviews?: ProductReview[];
}
