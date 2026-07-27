import { apiClient } from "./client";
import { Order, OrderStatus } from "@/lib/types";

export interface OrdersResponse {
  success: boolean;
  data: {
    orders: Order[];
  };
}

export interface SingleOrderResponse {
  success: boolean;
  data: {
    order: Order;
  };
}

export async function getOrdersApi(): Promise<OrdersResponse> {
  return apiClient<OrdersResponse>("/orders");
}

export async function getOrderByIdApi(id: string): Promise<SingleOrderResponse> {
  return apiClient<SingleOrderResponse>(`/orders/${id}`);
}

export async function createOrderApi(payload: {
  items: { productId: string; qty: number }[];
  deliveryAddress?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  total?: number;
}): Promise<SingleOrderResponse> {
  return apiClient<SingleOrderResponse>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateOrderStatusApi(id: string, status: OrderStatus): Promise<SingleOrderResponse> {
  return apiClient<SingleOrderResponse>(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
