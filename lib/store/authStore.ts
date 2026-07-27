import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginApi, refreshApi, logoutApi, meApi } from "@/lib/api/auth";

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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  initAuth: () => Promise<string | null>;
  switchRole: (role: UserRole) => void;
}

const rolePresets: Record<UserRole, AuthUser | null> = {
  guest: null,
  retail: {
    id: "u2",
    name: "Thabo Nkosi",
    email: "thabo@example.co.za",
    role: "retail",
    avatar: "https://placehold.co/100x100/10B981/FFFFFF?text=TN",
  },
  bulk_buyer: {
    id: "u4",
    name: "Sipho Dlamini",
    email: "sipho@smokeworld.co.za",
    role: "bulk_buyer",
    bulkStatus: "approved",
    businessName: "Smoke World Distributors",
    avatar: "https://placehold.co/100x100/7C3AED/FFFFFF?text=SD",
    totalOrders: 47,
    totalSpent: 186450.00,
    bulkSavings: 32780.00,
  },
  admin: {
    id: "u1",
    name: "Admin User",
    email: "admin@smoketimestore.co.za",
    role: "admin",
    avatar: "https://placehold.co/100x100/4F46E5/FFFFFF?text=AU",
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitializing: true,

      login: async (email, password) => {
        try {
          const res = await loginApi(email, password);
          if (res.success && res.data) {
            set({
              user: res.data.user,
              accessToken: res.data.accessToken,
              isAuthenticated: true,
            });
            return { success: true };
          }
          return { success: false, error: "Invalid email or password." };
        } catch (err: any) {
          return { success: false, error: err.message || "Invalid email or password." };
        }
      },

      logout: async () => {
        try {
          await logoutApi();
        } catch {
          // ignore logout errors
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },

      initAuth: async () => {
        try {
          const res = await refreshApi();
          if (res.success && res.data) {
            set({
              user: res.data.user,
              accessToken: res.data.accessToken,
              isAuthenticated: true,
              isInitializing: false,
            });
            return res.data.accessToken;
          }
        } catch {
          // Silent refresh failed — guest user
        }
        set({ user: null, accessToken: null, isAuthenticated: false, isInitializing: false });
        return null;
      },

      switchRole: (role) => {
        const preset = rolePresets[role];
        set({ user: preset, isAuthenticated: preset !== null });
      },
    }),
    {
      name: "smoke-time-auth",
      // Exclude accessToken from localStorage — lives in memory only
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
