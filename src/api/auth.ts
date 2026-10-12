import { apiClient } from "./client";
import type { LoginRequest, LoginResponse, MeResponse } from "../types/auth";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>("/api/v1/auth/login", request);
  return data.data;
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await apiClient.get<ApiResponse<MeResponse>>("/api/v1/auth/me");
  return data.data;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(request: ChangePasswordRequest): Promise<string> {
  const { data } = await apiClient.put<ApiResponse<unknown>>("/api/v1/auth/change-password", request);
  return data.message;
}
