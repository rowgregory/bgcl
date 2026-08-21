'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireUser } from '@/lib/utils/requireAdmin'

export const updateUserName = async ({ firstName, lastName }: { firstName: string; lastName: string }) => {
  const auth = await requireUser()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const user = await prisma.user.update({
      where: { id: auth.user.id },
      data: { firstName, lastName },
      select: { id: true, firstName: true, lastName: true }
    })

    return { success: true, data: user, error: null }
  } catch (error) {
    await createLog('error', 'Failed to update user name', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update name. Please try again.',
      data: null
    }
  }
}
