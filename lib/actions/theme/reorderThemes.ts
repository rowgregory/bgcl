import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'

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

    revalidatePath('/', 'layout')

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
