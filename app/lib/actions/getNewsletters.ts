import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'

export const getNewsletters = unstable_cache(
  async (): Promise<
    Array<{
      id: string
      order: number
      month: string
      year: number
      pdfUrl: string
      createdAt: Date
      updatedAt: Date
    }>
  > => {
    try {
      const newsletters = await prisma.newsletter.findMany({
        orderBy: { order: 'asc' }
      })

      return newsletters
    } catch (error) {
      await prisma.log.create({
        data: {
          level: 'error',
          message: 'Failed to fetch newsletters',
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })

      return []
    }
  },
  ['getNewsletters'],
  { tags: ['Newsletter'] }
)
