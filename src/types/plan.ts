export interface SubscriptionPlan {
  id: number;
  code: string;
  name: string;
  maxStudents: number;
  maxTeachers: number;
  annualPrice: number;
  active: boolean;
}

export interface SubscriptionPlanRequest {
  code: string;
  name: string;
  maxStudents: number;
  maxTeachers: number;
  annualPrice: number;
}
