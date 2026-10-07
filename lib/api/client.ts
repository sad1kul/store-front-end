import { useAuthStore } from "@/lib/store/authStore";
import { ApiError, request } from "./transport";

export { ApiError } from "./transport";

interface FetchOptions extends RequestInit {
  retryOn401?: boolean;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { retryOn401 = true, ...requestOptions } = options;
  const initial = useAuthStore.getState();
  try {
    return await request<T>(endpoint, requestOptions, initial.accessToken);
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 401 || !retryOn401) throw error;
    const current = useAuthStore.getState();
    if (current.sessionEpoch !== initial.sessionEpoch || options.signal?.aborted) throw error;
    const token = current.accessToken && current.accessToken !== initial.accessToken
      ? current.accessToken : await current.initAuth();
    if (!token || useAuthStore.getState().sessionEpoch !== initial.sessionEpoch) throw error;
    try {
      return await request<T>(endpoint, requestOptions, token);
    } catch (retryError) {
      if (retryError instanceof ApiError && retryError.status === 401
        && useAuthStore.getState().sessionEpoch === initial.sessionEpoch) {
        useAuthStore.getState().invalidateSession();
      }
      throw retryError;
    }
  }
}
