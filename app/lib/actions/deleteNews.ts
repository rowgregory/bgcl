'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function deleteNews(id: string) {
  try {
    const news = await prisma.news.findUnique({
      where: { id },
      select: { id: true, title: true }
    })

    if (!news) {
      return {
        success: false,
        error: 'News not found'
      }
    }

    await prisma.news.delete({
      where: { id }
    })

    await createLog('info', 'News deleted', {
      newsId: id,
      title: news.title
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete news', {
      error: error instanceof Error ? error.message : 'Unknown error',
      newsId: id
    })

    return {
      success: false,
      error: 'Failed to delete news. Please try again.'
    }
  }
}
