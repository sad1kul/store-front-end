import { apiClient } from "./client";
import { Product } from "@/lib/types";

export interface ProductsResponse {
  success: boolean;
  data: {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface SingleProductResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

export async function getProductsApi(params?: {
  category?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}): Promise<ProductsResponse> {
  const query = new URLSearchParams();
  if (params?.category) query.append("category", params.category);
  if (params?.search) query.append("search", params.search);
  if (params?.sortBy) query.append("sortBy", params.sortBy);
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.featured !== undefined) query.append("featured", String(params.featured));

  const qs = query.toString();
  return apiClient<ProductsResponse>(`/products${qs ? `?${qs}` : ""}`);
}

export async function getProductBySlugApi(slug: string): Promise<SingleProductResponse> {
  return apiClient<SingleProductResponse>(`/products/${slug}`);
}

export async function createProductApi(data: Partial<Product>): Promise<SingleProductResponse> {
  return apiClient<SingleProductResponse>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProductApi(id: string, data: Partial<Product>): Promise<SingleProductResponse> {
  return apiClient<SingleProductResponse>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProductApi(id: string): Promise<SingleProductResponse> {
  return apiClient<SingleProductResponse>(`/products/${id}`, {
    method: "DELETE",
  });
}
