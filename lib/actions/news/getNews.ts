import prisma from '@/prisma/client'
import { INews } from '@/types/entities/news'
import { createLog } from '../log/createLog'

export const getNews = async (): Promise<INews[]> => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { order: 'asc' }
    })

    return news
  } catch (error) {
    await createLog('error', 'Failed to fetch news', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
