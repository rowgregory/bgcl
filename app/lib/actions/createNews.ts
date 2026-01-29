'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export interface CreateNewsInput {
  title: string
  image?: string
  paragraph1?: string
  paragraph2?: string
  paragraph3?: string
  order?: number
}

export interface UpdateNewsInput extends CreateNewsInput {
  id: string
}

export async function createNews(data: CreateNewsInput) {
  try {
    const news = await prisma.news.create({
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
      message: 'News created successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to create news', {
      error: error instanceof Error ? error.message : 'Unknown error',
      title: data.title
    })

    return {
      success: false,
      error: 'Failed to create news. Please try again.'
    }
  }
}
