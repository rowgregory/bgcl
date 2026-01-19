import prisma from '@/prisma/client'
import { INews } from '@/types/entities/news'
import { unstable_cache } from 'next/cache'

export const getNews = unstable_cache(
  async (): Promise<INews[]> => {
    try {
      const news = await prisma.news.findMany({
        orderBy: { order: 'asc' }
      })

      return news
    } catch (error) {
      prisma.log.create({
        data: {
          level: 'error',
          message: 'Failed to fetch news',
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })

      return []
    }
  },
  ['getNews'],
  { tags: ['News'] }
)
