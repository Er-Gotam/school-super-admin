import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "../api/auditLogs";

export function useAuditLogs(page: number, size: number) {
  return useQuery({
    queryKey: ["super-admin", "audit-logs", page, size],
    queryFn: () => getAuditLogs(page, size),
    placeholderData: (previousData) => previousData,
    staleTime: 15_000,
  });
}
