'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { newsSchema } from '@/lib/validations/news.validation'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function createNews(input: unknown) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  const parsed = newsSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      data: null,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid news data'
    }
  }

  const data = parsed.data

  try {
    // Place new items at the end of the list
    const lastNews = await prisma.news.findFirst({ orderBy: { order: 'desc' } })

    const news = await prisma.news.create({
      data: {
        title: data.title,
        image: data.image || null,
        paragraph1: data.paragraph1 || null,
        paragraph2: data.paragraph2 || null,
        paragraph3: data.paragraph3 || null,
        externalLink: data.externalLink || null,
        order: (lastNews?.order ?? -1) + 1
      }
    })

    revalidatePath('/', 'layout')

    return {
      success: true,
      data: news,
      error: null
    }
  } catch (error) {
    await createLog('error', 'Failed to create news', {
      error: error instanceof Error ? error.message : 'Unknown error',
      title: data.title
    })

    return {
      success: false,
      data: null,
      error: 'Failed to create news. Please try again.'
    }
  }
}
