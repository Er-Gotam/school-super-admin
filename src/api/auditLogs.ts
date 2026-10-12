import { apiClient } from "./client";
import type { AuditLog, PageResult } from "../types/auditLog";

interface ApiResponse<T> { success: boolean; message: string; data: T; }

export async function getAuditLogs(page: number, size: number): Promise<PageResult<AuditLog>> {
  const { data } = await apiClient.get<ApiResponse<PageResult<AuditLog>>>(
    "/api/v1/super-admin/audit-logs",
    { params: { page, size, sort: "createdAt,desc" } },
  );
  return data.data;
}
