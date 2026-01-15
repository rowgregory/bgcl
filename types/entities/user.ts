import { Prisma } from '@prisma/client'

// Enums
export enum Role {
  STAFF = 'STAFF',
  VOLUNTEER = 'VOLUNTEER',
  ADMIN = 'ADMIN',
  SUPERUSER = 'SUPERUSER',
  SUPPORTER = 'SUPPORTER'
}

export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED'
}

export interface IUser {
  id: string
  email: string
  role: Role
  lastLoginAt: Date | null

  // Generic person info
  firstName: string | null
  lastName: string | null
  phone: string | null

  // Staff-only fields
  position: string | null
  department: string | null
  hireDate: Date | null
  staffStatus: StaffStatus | null

  // Flexible user-specific data
  metadata: Record<string, unknown> | null

  createdAt: Date
  updatedAt: Date
}

// Exact type that matches the getAllUsers select
export type UserWithCounts = Prisma.UserGetPayload<{
  select: {
    id: true
    email: true
    role: true
    createdAt: true
    updatedAt: true
    lastLoginAt: true
    firstName: true
    lastName: true
    phone: true
    position: true
    department: true
    hireDate: true
    staffStatus: true
    _count: {
      select: {
        events: true
        accounts: true
        sessions: true
      }
    }
  }
}>
