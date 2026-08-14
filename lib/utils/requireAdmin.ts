import 'server-only'
import type { Role } from '@prisma/client'
import { auth } from '../auth/auth'

export interface AuthedUser {
  id: string
  email: string
  role: Role
}

export interface AuthResult {
  ok: boolean
  user: AuthedUser | null
  error: string | null
}

const SUPERUSER_ROLES = ['SUPERUSER'] as const
const ADMIN_ROLES = ['ADMIN', 'SUPERUSER'] as const
const STAFF_ROLES = ['ADMIN', 'SUPERUSER', 'PROGRAM'] as const

const denied = (error: string): AuthResult => ({ ok: false, user: null, error })

/** Resolves the caller and checks their role. Never throws. */
export async function requireRole(roles: readonly Role[]): Promise<AuthResult> {
  const session = await auth()
  const user = session?.user

  if (!user?.id) return denied('You must be signed in to do that.')
  if (!user.role || !roles.includes(user.role)) return denied('You do not have permission to do that.')

  return {
    ok: true,
    user: { id: user.id, email: user.email ?? '', role: user.role },
    error: null
  }
}

/**
 * ADMIN and SUPERUSER by default. Pass { allowProgram: true } on actions
 * program staff are also allowed to perform. Call first in every admin action.
 */
export async function requireAdmin(options?: { allowProgram?: boolean }): Promise<AuthResult> {
  return requireRole(options?.allowProgram ? STAFF_ROLES : ADMIN_ROLES)
}

/** SUPERUSER only. For destructive or account-level actions. */
export async function requireSuperuser(): Promise<AuthResult> {
  return requireRole(SUPERUSER_ROLES)
}

/** Any signed-in user, regardless of role. */
export async function requireUser(): Promise<AuthResult> {
  const session = await auth()
  const user = session?.user

  if (!user?.id) return denied('You must be signed in to do that.')

  return {
    ok: true,
    user: { id: user.id, email: user.email ?? '', role: user.role as Role },
    error: null
  }
}

/** Boolean variants for conditional rendering, not for guarding mutations. */
export async function isAdmin(options?: { allowProgram?: boolean }): Promise<boolean> {
  const result = await requireAdmin(options)
  return result.ok
}

export async function isSuperuser(): Promise<boolean> {
  const result = await requireSuperuser()
  return result.ok
}
