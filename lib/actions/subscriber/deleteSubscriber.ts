'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function deleteSubscriber(id: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { id },
      select: { id: true, email: true }
    })

    if (!subscriber) {
      return {
        success: false,
        error: 'Subscriber not found'
      }
    }

    await prisma.subscriber.delete({
      where: { id }
    })

    await createLog('info', 'Subscriber deleted', {
      subscriberId: id,
      email: subscriber.email
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete subscriber', {
      error: error instanceof Error ? error.message : 'Unknown error',
      subscriberId: id
    })

    return {
      success: false,
      error: 'Failed to delete subscriber. Please try again.'
    }
  }
}
