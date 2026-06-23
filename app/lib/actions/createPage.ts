'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { revalidatePath } from 'next/cache'

export async function createPage(slug: string, content: any) {
  try {
    if (!slug || !content) {
      return {
        success: false,
        error: 'Missing required fields: slug, content'
      }
    }

    const page = await prisma.page.create({
      data: {
        slug,
        content
      }
    })

    await createLog('info', 'Page created', {
      slug: page.slug,
      pageId: page.id
    })

    revalidatePath('/', 'layout')

    return { success: true, page }
  } catch (error) {
    await createLog('error', 'Failed to create page', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    })

    return {
      success: false,
      error: 'Failed to create page. Please try again.'
    }
  }
}
