'use server'

import { revalidatePath } from 'next/cache'
import { createLog } from '../log/createLog'
import prisma from '@/prisma/client'

export async function updatePageBySlug(slug: string, content: any) {
  try {
    if (!content || typeof content !== 'object') {
      return {
        success: false,
        error: 'Content must be a valid object'
      }
    }

    const page = await prisma.page.update({
      where: { slug },
      data: { content }
    })

    await createLog('info', 'Page updated', {
      slug,
      pageId: page.id
    })

    revalidatePath('/', 'layout')

    return { success: true, page }
  } catch (error) {
    await createLog('error', 'Failed to update page', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    })

    return {
      success: false,
      error: 'Failed to update page. Please try again.'
    }
  }
}
