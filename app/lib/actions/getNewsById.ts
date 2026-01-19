'use server'

import { unstable_cache } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getNewsById = unstable_cache(
  async (id: string) => {
    try {
      const news = await prisma.news.findUnique({
        where: { id }
      })

      if (!news) {
        await createLog('warn', 'News not found', {
          newsId: id
        })
        return null
      }

      return { news }
    } catch (error) {
      await createLog('error', 'Failed to fetch news', {
        error: error instanceof Error ? error.message : 'Unknown error',
        newsId: id
      })
      return null
    }
  },
  ['getNewsById'],
  { tags: ['News'] }
)
