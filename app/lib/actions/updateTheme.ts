import prisma from '@/prisma/client'
import { IUpdateTheme } from '@/types/entities/theme'
import { createLog } from './createLog'
import { revalidateTag } from 'next/cache'

export async function updateTheme(data: IUpdateTheme) {
  try {
    const theme = await prisma.theme.update({
      where: { id: data.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.dates && { dates: data.dates }),
        ...(data.order !== undefined && { order: data.order })
      }
    })

    await createLog('info', 'Theme updated successfully', {
      themeId: theme.id,
      programId: theme.programId,
      title: theme.title
    })

    revalidateTag('Theme', 'default')

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update theme'

    await createLog('error', 'Failed to update theme', {
      error: errorMessage,
      themeId: data.id
    })

    throw new Error(errorMessage)
  }
}
