'use server'

import prisma from '@/prisma/client'
import { auth } from '../auth'
import { createLog } from './createLog'

export const updatePhoneNumber = async ({ phone }: { phone: string }) => {
  try {
    const session = await auth()
    if (!session?.user?.id) return { success: false, error: 'Unauthorized', data: null }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { phone },
      select: { id: true, phone: true }
    })

    return { success: true, data: user, error: null }
  } catch (error) {
    await createLog('error', 'Failed to update phone number', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update phone number. Please try again.',
      data: null
    }
  }
}
