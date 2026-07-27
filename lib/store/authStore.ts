/**
 * NOTE: This auth is mock/demo only. Replace with a real server-side API auth layer (e.g. NextAuth.js or JWT) before production.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import bcrypt from "bcryptjs";
import users from "@/lib/mock-data/users.json";

import { UserAccount } from "@/lib/types";

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
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void; // DevTools only
}

// Quick preset users for DevTools role switcher
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
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const found = (users as unknown as UserAccount[]).find((u) => u.email === email);
        if (!found) {
          return { success: false, error: "Invalid email or password." };
        }
        const isValid = await bcrypt.compare(password, found.password ?? "");
        if (!isValid) {
          return { success: false, error: "Invalid email or password." };
        }
        const user: AuthUser = {
          id: found.id,
          name: found.name,
          email: found.email,
          role: found.role as UserRole,
          bulkStatus: found.bulkStatus ?? null,
          businessName: found.businessName,
          avatar: found.avatar,
          totalOrders: found.totalOrders,
          totalSpent: found.totalSpent,
          bulkSavings: found.bulkSavings,
        };
        set({ user, isAuthenticated: true });
        return { success: true };
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      switchRole: (role) => {
        const preset = rolePresets[role];
        set({ user: preset, isAuthenticated: preset !== null });
      },
    }),
    { name: "smoke-time-auth" }
  )
);

