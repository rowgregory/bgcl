import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { unstable_cache } from 'next/cache'

export const getThemes = unstable_cache(
  async () => {
    try {
      const themes = await prisma.theme.findMany({
        orderBy: { order: 'asc' }
      })

      return themes
    } catch (error) {
      await createLog('error', 'Failed to fetch themes', {
        error: error instanceof Error ? error.message : 'Unknown error'
      })

      return null
    }
  },
  ['getThemes'],
  { tags: ['Thene'] }
)
