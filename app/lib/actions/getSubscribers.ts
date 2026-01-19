import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

export const getSubscribers = unstable_cache(
  async () => {
    try {
      const subscribers = await prisma.subscriber.findMany({
        orderBy: { subscribedAt: 'desc' }
      })

      return {
        success: true,
        data: subscribers
      }
    } catch (error) {
      await prisma.log.create({
        data: {
          level: 'error',
          message: 'Failed to fetch subscribers',
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch subscribers'
      }
    }
  },
  ['getSubscribers'],
  { tags: ['Subscriber'] }
)
