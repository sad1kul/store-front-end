import { apiClient } from "./client";
import { UserAccount } from "@/lib/types";

export interface UsersResponse {
  success: boolean;
  data: {
    users: UserAccount[];
  };
}

export interface SingleUserResponse {
  success: boolean;
  data: {
    user: UserAccount;
  };
}

export async function getUsersApi(): Promise<UsersResponse> {
  return apiClient<UsersResponse>("/users");
}

export async function getUserByIdApi(id: string): Promise<SingleUserResponse> {
  return apiClient<SingleUserResponse>(`/users/${id}`);
}

export async function updateUserApi(id: string, data: Partial<UserAccount>): Promise<SingleUserResponse> {
  return apiClient<SingleUserResponse>(`/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
