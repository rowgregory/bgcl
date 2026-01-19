'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function deleteNews(id: string) {
  try {
    await prisma.news.delete({
      where: { id }
    })

    revalidateTag('News', 'default')

    return {
      success: true,
      message: 'News deleted successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to delete news',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          newsId: id
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete news',
      message: 'Failed to delete news'
    }
  }
}
