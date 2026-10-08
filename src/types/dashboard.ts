export interface PlanDistribution {
  planId: string;
  planCode: string;
  planName: string;
  schoolCount: number;
}
export type SchoolStatus = "ACTIVE" | "SUSPENDED";
export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";
export interface RecentSchool { schoolId: string; name: string; phone: string; status: SchoolStatus; createdAt: string; }
export interface RecentSubscription {
  schoolId: string; schoolName: string; planId: string; planCode: string; planName: string;
  status: SubscriptionStatus; startsAt: string; expiresAt: string; updatedAt: string;
}
export interface SuperAdminDashboard {
  totalSchools: number; activeSchools: number; suspendedSchools: number;
  activeStudents: number; activeTeachers: number; activeSubscriptions: number;
  expiredSubscriptions: number; cancelledSubscriptions: number;
  planDistribution: PlanDistribution[]; recentSchools: RecentSchool[];
  recentSubscriptions: RecentSubscription[];
}