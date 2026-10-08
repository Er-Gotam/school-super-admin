export type UserRole = "SUPER_ADMIN" | "SCHOOL_ADMIN" | "TEACHER" | "PARENT";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  name: string;
  email: string;
  role: UserRole;
  mustChangePassword: boolean;
}

export interface MeResponse {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId: string | null;
  schoolName: string | null;
}