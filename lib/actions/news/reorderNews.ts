'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function reorderNews(news: Array<{ id: string; order?: number }>) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    await Promise.all(
      news.map((item, index) =>
        prisma.news.update({
          where: { id: item.id },
          data: { order: index + 1 }
        })
      )
    )

    revalidatePath('/', 'layout')

    return { success: true, error: null }
  } catch (error) {
    await createLog('error', 'Failed to reorder news', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Failed to reorder news. Please try again.' }
  }
}
