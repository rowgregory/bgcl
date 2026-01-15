import prisma from '@/prisma/client'
import { unstable_cache } from 'next/cache'
import { createLog } from './createLog'

export const getPageBySlug = unstable_cache(
  async (slug: string) => {
    try {
      const page = await prisma.page.findUnique({
        where: { slug }
      })

      if (!page) {
        await createLog('warn', 'Page not found', {
          slug
        })
        return null
      }

      return page
    } catch (error) {
      await createLog('error', 'Failed to fetch page', {
        error: error instanceof Error ? error.message : 'Unknown error',
        slug
      })
      return null
    }
  },
  ['getPageBySlug'],
  { tags: ['Page'] }
)
