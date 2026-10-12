import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { assignSchoolPlan, getSchoolSubscriptionUsage, renewSchoolSubscription } from "../api/subscriptions";

const usageKey = ["super-admin", "subscription-usage"];

export function useSchoolSubscriptionUsage(schoolId: string) {
  return useQuery({
    queryKey: [...usageKey, schoolId],
    queryFn: () => getSchoolSubscriptionUsage(schoolId),
    retry: false,
    staleTime: 30_000,
  });
}

export function useAssignSchoolPlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ schoolId, planId }: { schoolId: string; planId: number }) => assignSchoolPlan(schoolId, planId),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [...usageKey, variables.schoolId] });
      qc.invalidateQueries({ queryKey: ["super-admin", "dashboard"] });
    },
  });
}

export function useRenewSchoolSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: renewSchoolSubscription,
    onSuccess: (_, schoolId) => {
      qc.invalidateQueries({ queryKey: [...usageKey, schoolId] });
      qc.invalidateQueries({ queryKey: ["super-admin", "dashboard"] });
    },
  });
}
