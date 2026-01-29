'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export interface UpdateNewsInput {
  id: string
  title: string
  image?: string
  paragraph1?: string
  paragraph2?: string
  paragraph3?: string
  order?: number
}

export async function updateNews(data: UpdateNewsInput) {
  try {
    const news = await prisma.news.update({
      where: { id: data.id },
      data: {
        title: data.title,
        image: data.image || null,
        paragraph1: data.paragraph1 || null,
        paragraph2: data.paragraph2 || null,
        paragraph3: data.paragraph3 || null,
        order: data.order ?? 0
      }
    })

    revalidateTag('News', 'default')

    return {
      success: true,
      data: news,
      message: 'News updated successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to update news.', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update news. Please try again.'
    }
  }
}
