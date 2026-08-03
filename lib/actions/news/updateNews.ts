'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { newsSchema } from '@/lib/validations/news.validation'

export async function updateNews(id: string, input: unknown) {
  if (!id) {
    return { success: false, error: 'News ID is required.' }
  }

  const parsed = newsSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid news data'
    }
  }

  const data = parsed.data

  try {
    const news = await prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        image: data.image || null,
        paragraph1: data.paragraph1 || null,
        paragraph2: data.paragraph2 || null,
        paragraph3: data.paragraph3 || null,
        externalLink: data.externalLink || null
      }
    })

    revalidatePath('/', 'layout')

    return {
      success: true,
      data: news,
      message: 'News updated successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to update news.', {
      newsId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update news. Please try again.'
    }
  }
}
