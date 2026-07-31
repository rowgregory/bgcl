'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { UpdateNewsInput } from '@/types/entities/news'
import { revalidatePath } from 'next/cache'

export async function updateNews(data: UpdateNewsInput) {
  try {
    const news = await prisma.news.update({
      where: { id: data.id },
      data: {
        title: data.title,
        image: data.image || null,
        paragraph1: data.paragraph1 || null,
        paragraph2: data.paragraph2 || null,
        order: data.order ?? 0,
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
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update news. Please try again.'
    }
  }
}
