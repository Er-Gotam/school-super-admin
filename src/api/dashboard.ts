import { apiClient } from "./client";
import type { SuperAdminDashboard } from "../types/dashboard";

interface ApiResponse<T> { success: boolean; message: string; data: T; }

export async function getDashboard(): Promise<SuperAdminDashboard> {
  const { data } = await apiClient.get<ApiResponse<SuperAdminDashboard>>("/api/v1/super-admin/dashboard");
  return data.data;
}