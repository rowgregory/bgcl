import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { revalidateTag } from 'next/cache'

export async function deleteTheme(id: string) {
  try {
    const theme = await prisma.theme.delete({
      where: { id }
    })

    await createLog('info', 'Theme deleted successfully', {
      themeId: id,
      programId: theme.programId,
      title: theme.title
    })

    revalidateTag('Theme', 'default')

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete theme'

    await createLog('error', 'Failed to delete theme', {
      error: errorMessage,
      themeId: id
    })

    throw new Error(errorMessage)
  }
}
