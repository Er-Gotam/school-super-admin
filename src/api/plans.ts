import { apiClient } from "./client";
import type { SubscriptionPlan, SubscriptionPlanRequest } from "../types/plan";
interface ApiResponse<T> { success: boolean; message: string; data: T; }
export async function getPlans(): Promise<SubscriptionPlan[]> { const { data } = await apiClient.get<ApiResponse<SubscriptionPlan[]>>("/api/v1/super-admin/subscriptions/plans"); return data.data; }
export async function createPlan(request: SubscriptionPlanRequest): Promise<SubscriptionPlan> { const { data } = await apiClient.post<ApiResponse<SubscriptionPlan>>("/api/v1/super-admin/subscriptions/plans", request); return data.data; }
export async function updatePlan(id: number, request: SubscriptionPlanRequest): Promise<SubscriptionPlan> { const { data } = await apiClient.put<ApiResponse<SubscriptionPlan>>("/api/v1/super-admin/subscriptions/plans/" + id, request); return data.data; }
export async function activatePlan(id: number): Promise<SubscriptionPlan> { const { data } = await apiClient.patch<ApiResponse<SubscriptionPlan>>("/api/v1/super-admin/subscriptions/plans/" + id + "/activate"); return data.data; }
export async function deactivatePlan(id: number): Promise<SubscriptionPlan> { const { data } = await apiClient.patch<ApiResponse<SubscriptionPlan>>("/api/v1/super-admin/subscriptions/plans/" + id + "/deactivate"); return data.data; }
