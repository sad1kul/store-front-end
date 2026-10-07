import { apiClient } from "./client";
import { BulkPricingTier } from "@/lib/types";

export interface ValidatedCartItem {
  productId: string;
  name: string;
  slug: string;
  sku: string;
  image: string;
  retailPrice: number;
  unitPrice: number;
  qty: number;
  lineTotal: number;
  isBulkPriced: boolean;
  bulkPricingTiers: BulkPricingTier[];
  availableStock: number;
}

export interface StockIssue {
  productId: string;
  name: string;
  requestedQty: number;
  availableStock: number;
}

export interface ValidatedCart {
  items: ValidatedCartItem[];
  subtotal: number;
  vat: number;
  total: number;
  bulkSavings: number;
  stockIssues: StockIssue[];
}

export interface ValidateCartResponse {
  success: boolean;
  data: ValidatedCart;
}

export async function validateCartApi(items: { productId: string; qty: number }[]): Promise<ValidateCartResponse> {
  return apiClient<ValidateCartResponse>("/cart/validate", {
    method: "POST",
    body: JSON.stringify({ items }),
  });
}
