import { request } from "./transport";
import type { AuthUser } from "@/lib/store/authStore";

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: AuthUser;
  };
}

export interface MeResponse {
  success: boolean;
  data: {
    user: AuthUser;
  };
}

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(data: { name: string; email: string; password: string }): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function refreshApi(): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/refresh", {
    method: "POST",
  });
}

export async function logoutApi(): Promise<{ success: boolean }> {
  return request<{ success: boolean }>("/auth/logout", {
    method: "POST",
  });
}

export async function meApi(token: string): Promise<MeResponse> {
  return request<MeResponse>("/auth/me", {
    method: "GET",
  }, token);
}
