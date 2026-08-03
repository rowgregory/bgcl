import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { News } from '@prisma/client'

export const getNews = async (): Promise<News[]> => {
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
