export interface AuditLog {
  id: string;
  actorId: string | null;
  actorName: string | null;
  actorEmail: string | null;
  schoolId: string | null;
  schoolName: string | null;
  action: string;
  targetType: string | null;
  targetId: string | null;
  details: string | null;
  createdAt: string;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
