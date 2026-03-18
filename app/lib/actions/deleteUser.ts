'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function deleteUser(id: string) {
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
