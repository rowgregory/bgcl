import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getThemes = async () => {
  try {
    const themes = await prisma.theme.findMany({
      orderBy: { order: 'desc' }
    })

    return themes
  } catch (error) {
    await createLog('error', 'Failed to fetch themes', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return null
  }
}
