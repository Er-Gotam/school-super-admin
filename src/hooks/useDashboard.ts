import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: ["super-admin", "dashboard"],
    queryFn: getDashboard,
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
}