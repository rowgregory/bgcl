'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function createPage(slug: string, content: any) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  if (!slug || !content) {
    return {
      success: false,
      data: null,
      error: 'Missing required fields: slug, content'
    }
  }

  try {
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

    return { success: true, page, error: null }
  } catch (error) {
    await createLog('error', 'Failed to create page', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    })

    return {
      success: false,
      data: null,
      error: 'Failed to create page.'
    }
  }
}
