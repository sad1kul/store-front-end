import { create } from "zustand";
import { loginApi, refreshApi, logoutApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/transport";

export type UserRole = "guest" | "retail" | "bulk_buyer" | "admin";
export type BulkStatus = "approved" | "pending" | "rejected" | null;

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bulkStatus?: BulkStatus;
  businessName?: string;
  avatar?: string;
  totalOrders?: number;
  totalSpent?: number;
  bulkSavings?: number;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  sessionEpoch: number;
  sessionError: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initAuth: () => Promise<string | null>;
  invalidateSession: () => void;
}

const signedOut = { user: null, accessToken: null, isAuthenticated: false, isInitializing: false };
const errorMessage = (error: unknown) => error instanceof Error ? error.message : "Unable to complete this request.";

export function createAuthStore(api = { login: loginApi, refresh: refreshApi, logout: logoutApi }) {
  let refreshFlight: { epoch: number; promise: Promise<string | null> } | undefined;
  let refreshBlocked = false;
  let mutations: Promise<unknown> = Promise.resolve();

  // Serialize cookie-writing operations, including login followed immediately by logout.
  function mutate<T>(operation: () => Promise<T>): Promise<T> {
    const result = mutations.then(operation, operation);
    mutations = result.catch(() => undefined);
    return result;
  }

  return create<AuthState>()((set, get) => ({
    ...signedOut,
    isInitializing: true,
    sessionEpoch: 0,
    sessionError: null,

    invalidateSession: () => {
      refreshBlocked = true;
      set({ ...signedOut, sessionEpoch: get().sessionEpoch + 1, sessionError: null });
    },

    login: async (email, password) => {
      const epoch = get().sessionEpoch + 1;
      refreshBlocked = true;
      set({ ...signedOut, sessionEpoch: epoch, sessionError: null });
      try {
        const response = await mutate(() => api.login(email, password));
        if (get().sessionEpoch !== epoch) return { success: false, error: "Sign-in was cancelled." };
        if (!response.success) return { success: false, error: "Invalid email or password." };
        refreshBlocked = false;
        set({ user: response.data.user, accessToken: response.data.accessToken, isAuthenticated: true });
        return { success: true };
      } catch (error) {
        return { success: false, error: errorMessage(error) };
      }
    },

    logout: async () => {
      get().invalidateSession();
      const epoch = get().sessionEpoch;
      try {
        await mutate(() => api.logout());
      } catch (error) {
        if (get().sessionEpoch === epoch) {
          set({ sessionError: "Signed out on this page, but the server session could not be revoked. Retry signing out." });
        }
        throw error;
      }
    },

    initAuth: () => {
      if (refreshBlocked) return Promise.resolve(null);
      const epoch = get().sessionEpoch;
      if (refreshFlight?.epoch === epoch) return refreshFlight.promise;
      const promise = (async () => {
        try {
          const response = await api.refresh();
          if (get().sessionEpoch !== epoch) return null;
          if (!response.success) throw new ApiError("Please sign in again.", 401);
          set({ user: response.data.user, accessToken: response.data.accessToken,
            isAuthenticated: true, isInitializing: false, sessionError: null });
          return response.data.accessToken;
        } catch (error) {
          if (get().sessionEpoch !== epoch) return null;
          if (error instanceof ApiError && error.status === 401) {
            get().invalidateSession();
            return null;
          }
          set({ isInitializing: false, sessionError: errorMessage(error) });
          throw error;
        } finally {
          if (refreshFlight?.epoch === epoch) refreshFlight = undefined;
        }
      })();
      refreshFlight = { epoch, promise };
      return promise;
    },
  }));
}

// Account details and bearer tokens stay in memory; the HttpOnly cookie restores sessions.
export const useAuthStore = createAuthStore();
