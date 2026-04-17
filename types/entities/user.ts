import { Role, StaffStatus } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

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
  metadata: Record<string, unknown> | null | JsonValue

  createdAt: Date
  updatedAt: Date
}

export interface CreateUserInputs {
  email: string
  firstName: string
  lastName: string
  role: Role
  phone?: string
  position?: string
  department?: string
}

export interface UpdateUserInputs {
  id: string
  email?: string
  firstName?: string
  lastName?: string
  role?: Role
  phone?: string
}
