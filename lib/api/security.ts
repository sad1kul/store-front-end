import { apiClient } from "./client";

export interface AccountSession {
  id: string;
  createdAt: string;
  expiresAt: string;
  current: boolean;
}

export const listSessionsApi = () => apiClient<{ success: boolean; data: { sessions: AccountSession[] } }>("/auth/sessions");
export const revokeSessionApi = (id: string) => apiClient<{ success: boolean }>(`/auth/sessions/${encodeURIComponent(id)}`, { method: "DELETE" });
export const revokeOtherSessionsApi = () => apiClient<{ success: boolean }>("/auth/sessions/others", { method: "DELETE" });
export const changePasswordApi = (currentPassword: string, newPassword: string) => apiClient<{ success: boolean; message: string }>("/auth/password", {
  method: "PATCH", body: JSON.stringify({ currentPassword, newPassword }),
});
