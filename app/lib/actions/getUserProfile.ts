'use server'

import { auth } from '@/app/lib/auth'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function getUserProfile() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      await createLog('warn', 'Unauthorized profile access attempt', {
        session
      })
      return { success: false, error: 'Unauthorized', status: 401 }
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      await createLog('warn', 'User profile not found', {
        userId: session.user.id
      })
      return { success: false, error: 'Profile not found', status: 404 }
    }

    await createLog('info', 'Profile retrieved successfully', {
      userId: session.user.id
    })

    return { success: true, user }
  } catch (error) {
    await createLog('error', 'Failed to retrieve profile', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })

    return {
      success: false,
      error: 'Internal server error',
      status: 500
    }
  }
}
