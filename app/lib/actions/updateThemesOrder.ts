import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export async function updateThemesOrder(themes: { id: string; order: number }[]) {
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to reorder themes'

    await createLog('error', 'Failed to reorder themes', { error: errorMessage })

    throw new Error(errorMessage)
  }
}
