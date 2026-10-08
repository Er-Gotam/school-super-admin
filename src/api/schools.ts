import { apiClient } from "./client";
import type { CreateSchoolRequest, School, UpdateSchoolRequest } from "../types/school";
interface ApiResponse<T> { success: boolean; message: string; data: T; }
export async function getSchools(): Promise<School[]> { const { data } = await apiClient.get<ApiResponse<School[]>>("/api/v1/super-admin/schools"); return data.data; }
export async function getSchool(id: string): Promise<School> { const { data } = await apiClient.get<ApiResponse<School>>(`/api/v1/super-admin/schools/${id}`); return data.data; }
export async function createSchool(request: CreateSchoolRequest): Promise<School> { const { data } = await apiClient.post<ApiResponse<School>>("/api/v1/super-admin/schools", request); return data.data; }
export async function updateSchool(id: string, request: UpdateSchoolRequest): Promise<School> { const { data } = await apiClient.put<ApiResponse<School>>(`/api/v1/super-admin/schools/${id}`, request); return data.data; }
export async function activateSchool(id: string): Promise<School> { const { data } = await apiClient.patch<ApiResponse<School>>(`/api/v1/super-admin/schools/${id}/activate`); return data.data; }
export async function suspendSchool(id: string): Promise<School> { const { data } = await apiClient.patch<ApiResponse<School>>(`/api/v1/super-admin/schools/${id}/suspend`); return data.data; }