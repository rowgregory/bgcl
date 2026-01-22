import prisma from '@/prisma/client'
import { IClosing } from '@/types/entities/closing'
import { unstable_cache } from 'next/cache'

export const getClosings = unstable_cache(
  async (): Promise<IClosing[]> => {
    try {
      const closings = await prisma.closing.findMany({
        orderBy: { order: 'asc' }
      })

      return closings
    } catch (error) {
      prisma.log.create({
        data: {
          level: 'error',
          message: 'Failed to fetch closings',
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })

      return []
    }
  },
  ['getClosings'],
  { tags: ['Closing'] }
)
