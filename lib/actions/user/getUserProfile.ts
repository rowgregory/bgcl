'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { requireUser } from '@/lib/utils/requireAdmin'

export async function getUserProfile() {
  const auth = await requireUser()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const user = await prisma.user.findUnique({
      where: { id: auth.user.id }
    })

    if (!user) {
      await createLog('warn', 'User profile not found', {
        userId: auth.user.id
      })
      return { success: false, error: 'Profile not found', status: 404 }
    }

    return { success: true, user }
  } catch (error) {
    await createLog('error', 'Failed to fetch user profile', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to fetch user profile. Please try again.'
    }
  }
}
