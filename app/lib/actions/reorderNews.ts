'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function reorderNews(
  news: Array<{ id: string; order?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.all(
      news.map((item, index) =>
        prisma.news.update({
          where: { id: item.id },
          data: { order: index + 1 }
        })
      )
    )

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder news', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to reorder news. Please try again.' }
  }
}
