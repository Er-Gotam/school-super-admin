import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activatePlan, createPlan, deactivatePlan, getPlans, updatePlan } from "../api/plans";
import type { SubscriptionPlanRequest } from "../types/plan";
const plansKey = ["super-admin", "subscription-plans"];
export function usePlans() { return useQuery({ queryKey: plansKey, queryFn: getPlans, staleTime: 30_000 }); }
export function useCreatePlan() { const qc = useQueryClient(); return useMutation({ mutationFn: createPlan, onSuccess: () => qc.invalidateQueries({ queryKey: plansKey }) }); }
export function useUpdatePlan() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, request }: { id: number; request: SubscriptionPlanRequest }) => updatePlan(id, request), onSuccess: () => qc.invalidateQueries({ queryKey: plansKey }) }); }
export function useChangePlanStatus() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, active }: { id: number; active: boolean }) => active ? activatePlan(id) : deactivatePlan(id), onSuccess: () => qc.invalidateQueries({ queryKey: plansKey }) }); }
