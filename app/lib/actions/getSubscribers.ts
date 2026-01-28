import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getSubscribers = async () => {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' }
    })

    return {
      success: true,
      data: subscribers
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch subscribers', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
