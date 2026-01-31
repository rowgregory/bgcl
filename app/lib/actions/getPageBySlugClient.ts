import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getPageBySlugClient = async (slug: string) => {
  try {
    const page = await prisma.page.findUnique({
      where: { slug }
    })

    if (!page) {
      await createLog('warn', 'Page not found', {
        slug
      })
      return { page: null, sections: null, error: null }
    }

    // Parse and organize content by sections
    const content = page.content as any[]

    const sections = content?.reduce(
      (acc, field) => {
        const [section, ...keyParts] = field.id.split('_')
        const key = keyParts.join('_')

        if (!acc[section]) {
          acc[section] = {}
        }

        acc[section][key] = field.value
        return acc
      },
      {} as Record<string, Record<string, any>>
    )

    return {
      page,
      sections,
      error: null
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch page by slug', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    })

    return {
      page: null,
      sections: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
