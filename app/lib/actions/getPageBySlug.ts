import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getPageBySlug = async (slug: string) => {
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
    await createLog('error', 'Failed to fetch page by slug', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    })
    return error
  }
}
