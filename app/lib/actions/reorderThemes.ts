import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export async function reorderThemes(themes: Array<{ id: string; order: number }>) {
  try {
    await prisma.$transaction(
      themes.map(({ id, order }) =>
        prisma.theme.update({
          where: { id },
          data: { order }
        })
      )
    )

    revalidateTag('Theme', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder themes', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to reorder themes. Please try again.'
    }
  }
}
