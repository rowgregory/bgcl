'use server'

import prisma from '@/prisma/client'
import { revalidatePath } from 'next/cache'
import { createLog } from '../log/createLog'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function deleteNews(id: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const news = await prisma.news.findUnique({
      where: { id },
      select: { id: true, title: true }
    })

    if (!news)
      return {
        success: false,
        data: null,
        error: 'News not found'
      }

    await prisma.news.delete({
      where: { id }
    })

    await createLog('info', 'News deleted', {
      newsId: id,
      title: news.title
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete news', {
      error: error instanceof Error ? error.message : 'Unknown error',
      newsId: id
    })

    return {
      success: false,
      data: null,
      error: 'Could not delete news'
    }
  }
}
