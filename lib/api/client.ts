import { useAuthStore } from "@/lib/store/authStore";

const BASE_URL = "/api";

interface FetchOptions extends RequestInit {
  retryOn401?: boolean;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { retryOn401 = true, headers: customHeaders, ...restOptions } = options;

  const accessToken = useAuthStore.getState().accessToken;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const url = endpoint.startsWith("/") ? `${BASE_URL}${endpoint}` : `${BASE_URL}/${endpoint}`;

  const response = await fetch(url, {
    ...restOptions,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && retryOn401 && !endpoint.includes("/auth/login") && !endpoint.includes("/auth/refresh")) {
    try {
      const refreshedToken = await useAuthStore.getState().initAuth();
      if (refreshedToken) {
        return apiClient<T>(endpoint, { ...options, retryOn401: false });
      } else {
        useAuthStore.getState().logout();
      }
    } catch {
      useAuthStore.getState().logout();
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}
