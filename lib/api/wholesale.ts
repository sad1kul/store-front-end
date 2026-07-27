import { apiClient } from "./client";
import { WholesaleApplication } from "@/lib/types";

export interface ApplicationsResponse {
  success: boolean;
  data: {
    applications: WholesaleApplication[];
  };
}

export interface SingleApplicationResponse {
  success: boolean;
  data: {
    application: WholesaleApplication;
  };
}

export async function getWholesaleApplicationsApi(): Promise<ApplicationsResponse> {
  return apiClient<ApplicationsResponse>("/wholesale/applications");
}

export async function applyWholesaleApi(data: Partial<WholesaleApplication>): Promise<SingleApplicationResponse> {
  return apiClient<SingleApplicationResponse>("/wholesale/apply", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function reviewWholesaleApplicationApi(
  id: string,
  decision: { status: "approved" | "rejected"; rejectionReason?: string; notes?: string }
): Promise<SingleApplicationResponse> {
  return apiClient<SingleApplicationResponse>(`/wholesale/applications/${id}`, {
    method: "PATCH",
    body: JSON.stringify(decision),
  });
}
