import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export const getSubscribers = async () => {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { subscribedAt: 'desc' }
    })

    return subscribers
  } catch (error) {
    await createLog('error', 'Failed to fetch subscribers', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
