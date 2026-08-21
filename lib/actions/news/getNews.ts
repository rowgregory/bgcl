import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export async function getNews() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { order: 'asc' }
    })

    return { success: true, data: news, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch news', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load news' }
  }
}
