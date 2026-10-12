export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface SubscriptionUsage {
  schoolId: string;
  schoolName: string;
  planId: number | null;
  planCode: string | null;
  planName: string | null;
  status: SubscriptionStatus | null;
  startsAt: string | null;
  expiresAt: string | null;
  studentsUsed: number;
  maxStudents: number;
  studentsRemaining: number;
  teachersUsed: number;
  maxTeachers: number;
  teachersRemaining: number;
}

export interface SchoolSubscriptionAssignment {
  schoolId: string;
  planId: number;
}
