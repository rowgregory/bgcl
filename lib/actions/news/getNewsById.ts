import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export async function getNewsById(id: string) {
  try {
    const news = await prisma.news.findUnique({
      where: { id }
    })

    if (!news) {
      await createLog('warn', 'News not found', {
        newsId: id
      })
      return null
    }

    return { success: true, data: news, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch news', {
      error: error instanceof Error ? error.message : 'Unknown error',
      newsId: id
    })
    return { success: false, data: null, error: 'Could not load news' }
  }
}
