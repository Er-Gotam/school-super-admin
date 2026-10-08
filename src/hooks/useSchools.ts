import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { activateSchool, createSchool, getSchool, getSchools, suspendSchool, updateSchool } from "../api/schools";
import type { CreateSchoolRequest, UpdateSchoolRequest } from "../types/school";
const key = ["super-admin", "schools"];
export function useSchools() { return useQuery({ queryKey: key, queryFn: getSchools, staleTime: 30_000 }); }
export function useSchool(id: string | undefined) { return useQuery({ queryKey: [...key, id], queryFn: () => getSchool(id!), enabled: Boolean(id) }); }
export function useCreateSchool() { const qc = useQueryClient(); return useMutation({ mutationFn: (request: CreateSchoolRequest) => createSchool(request), onSuccess: () => qc.invalidateQueries({ queryKey: key }) }); }
export function useUpdateSchool() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, request }: { id: string; request: UpdateSchoolRequest }) => updateSchool(id, request), onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: key }); qc.invalidateQueries({ queryKey: [...key, v.id] }); } }); }
export function useChangeSchoolStatus() { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, status }: { id: string; status: "ACTIVE" | "SUSPENDED" }) => status === "ACTIVE" ? activateSchool(id) : suspendSchool(id), onSuccess: (_, v) => { qc.invalidateQueries({ queryKey: key }); qc.invalidateQueries({ queryKey: [...key, v.id] }); } }); }