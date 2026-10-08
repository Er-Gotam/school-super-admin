export type SchoolStatus = "ACTIVE" | "SUSPENDED";
export interface School { id: string; name: string; phone: string; address: string; status: SchoolStatus; }
export interface CreateSchoolRequest { schoolName: string; schoolPhone: string; schoolAddress: string; adminName: string; adminEmail: string; adminPassword: string; }
export interface UpdateSchoolRequest { name: string; phone: string; address: string; }