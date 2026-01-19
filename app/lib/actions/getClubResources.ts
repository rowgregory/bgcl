import prisma from '@/prisma/client'
import { IClubResource } from '@/types/entities/club-resource'
import { unstable_cache } from 'next/cache'

export const getClubResources = unstable_cache(
  async (): Promise<IClubResource[]> => {
    try {
      const clubResources = await prisma.resource.findMany({
        orderBy: { order: 'asc' }
      })

      return clubResources
    } catch (error) {
      prisma.log.create({
        data: {
          level: 'error',
          message: 'Failed to fetch club resources',
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })

      return []
    }
  },
  ['getClubResources'],
  { tags: ['Club-Resource'] }
)
