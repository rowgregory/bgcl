'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function updateNewsOrder(
  news: Array<{ id: string; order?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.all(
      news.map((item, index) =>
        prisma.program.update({
          where: { id: item.id },
          data: { order: index + 1 }
        })
      )
    )

    revalidateTag('News', 'default')
    return { success: true }
  } catch (error) {
    console.error('Error reordering news:', error)
    return { success: false, error: 'Failed to reorder news' }
  }
}
