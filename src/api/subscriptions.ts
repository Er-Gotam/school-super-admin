import { apiClient } from "./client";
import type { SubscriptionUsage } from "../types/subscription";

interface ApiResponse<T> { success: boolean; message: string; data: T; }

export async function getSchoolSubscriptionUsage(schoolId: string): Promise<SubscriptionUsage> {
  const { data } = await apiClient.get<ApiResponse<SubscriptionUsage>>("/api/v1/super-admin/subscriptions/schools/" + schoolId + "/usage");
  return data.data;
}

export async function assignSchoolPlan(schoolId: string, planId: number): Promise<unknown> {
  const { data } = await apiClient.put<ApiResponse<unknown>>("/api/v1/super-admin/subscriptions/schools/" + schoolId + "/plan/" + planId);
  return data.data;
}

export async function renewSchoolSubscription(schoolId: string): Promise<unknown> {
  const { data } = await apiClient.post<ApiResponse<unknown>>("/api/v1/super-admin/subscriptions/schools/" + schoolId + "/renew");
  return data.data;
}
