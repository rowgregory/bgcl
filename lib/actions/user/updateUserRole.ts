'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { Role } from '@prisma/client'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'

const ASSIGNABLE_ROLES = ['ADMIN', 'SUPPORTER', 'PROGRAM'] as const

const updateUserRoleSchema = z.object({
  role: z.enum(ASSIGNABLE_ROLES)
})

export async function updateUserRole(id: string, input: unknown) {
  const auth = await requireAdmin()
  if (!auth.ok) return { success: false, data: null, error: auth.error }

  if (!id) {
    return { success: false, data: null, error: 'User ID is required.' }
  }

  const parsed = updateUserRoleSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      data: null,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid role'
    }
  }

  const { role } = parsed.data

  // An admin removing their own admin role would lock them out mid-session
  if (id === auth.user.id && role !== auth.user.role) {
    return { success: false, data: null, error: 'You cannot change your own role.' }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true }
    })

    if (!existingUser) {
      return { success: false, data: null, error: 'User not found' }
    }

    if (existingUser.role === role) {
      return { success: true, data: existingUser, error: null }
    }

    if (existingUser.role === 'SUPERUSER') {
      return { success: false, data: null, error: 'You cannot change a super admin.' }
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true }
    })

    revalidatePath('/', 'layout')

    await createLog('info', 'User role updated', {
      actorId: auth.user.id,
      userId: user.id,
      email: user.email,
      previousRole: existingUser.role,
      newRole: role
    })

    return { success: true, data: user, error: null }
  } catch (error) {
    await createLog('error', 'Failed to update user role', {
      actorId: auth.user.id,
      userId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Failed to update role. Please try again.' }
  }
}
