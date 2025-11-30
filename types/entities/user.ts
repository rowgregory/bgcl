// Enums
export enum Role {
  STAFF = "STAFF",
  VOLUNTEER = "VOLUNTEER",
  ADMIN = "ADMIN",
  SUPERUSER = "SUPERUSER",
  SUPPORTER = "SUPPORTER",
}

export enum StaffStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ON_LEAVE = "ON_LEAVE",
  TERMINATED = "TERMINATED",
}

export interface IUser {
  id: string;
  email: string;
  role: Role;
  lastLoginAt: Date | null;

  // Generic person info
  firstName: string | null;
  lastName: string | null;
  phone: string | null;

  // Staff-only fields
  position: string | null;
  department: string | null;
  hireDate: Date | null;
  staffStatus: StaffStatus | null;

  // Flexible user-specific data
  metadata: Record<string, unknown> | null;

  createdAt: Date;
  updatedAt: Date;
}
