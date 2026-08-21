'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function deleteUser(id: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, firstName: true, lastName: true, email: true, role: true }
    })

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      }
    }

    await prisma.user.delete({
      where: { id }
    })

    await createLog('info', 'User deleted', {
      userId: id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete user', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: id
    })

    return {
      success: false,
      error: 'Failed to delete user. Please try again.'
    }
  }
}
