import { BulkPricingTier } from "./product";

export interface OrderItem {
  id?: string;
  productId?: string;
  productName?: string;
  name?: string;
  slug?: string;
  sku: string;
  image?: string;
  retailPrice?: number;
  bulkPricingTiers?: BulkPricingTier[];
  qty: number;
  isBulkPriced?: boolean;
  unitPrice: number;
  lineTotal?: number;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  isBulkOrder?: boolean;
  items: OrderItem[];
  subtotal: number;
  vat: number;
  total: number;
  bulkSavings: number;
  status: OrderStatus;
  estimatedDelivery?: string;
  adminNotes?: string;
}
