import { apiClient } from "./client";

export interface ContentData {
  heroHeading: string;
  heroSubtext: string;
  promoBannerText: string;
  featuredProductIds: string[];
}

export interface ContentResponse {
  success: boolean;
  data: {
    content: ContentData;
  };
}

export async function getContentApi(): Promise<ContentResponse> {
  return apiClient<ContentResponse>("/content");
}

export async function updateContentApi(data: Partial<ContentData>): Promise<ContentResponse> {
  return apiClient<ContentResponse>("/content", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
