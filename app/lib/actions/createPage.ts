'use server'

// import { auth } from '@/app/lib/auth'
import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export async function createPage(slug: string, content: any) {
  try {
    // const session = await auth()

    // if (!session?.user?.id) {
    //   await createLog('warn', 'Unauthorized page creation attempt', {
    //     session
    //   })
    //   return { success: false, error: 'Unauthorized', status: 401 }
    // }

    if (!slug || !content) {
      return {
        success: false,
        error: 'Missing required fields: slug, content',
        status: 400
      }
    }

    const page = await prisma.page.create({
      data: {
        slug,
        content
        // createdBy: session.user.id
      }
    })

    await createLog('info', 'Page created', {
      // userId: session.user.id,
      // userName: session.user.name,
      slug: page.slug,
      pageId: page.id
    })

    revalidateTag('Page', 'default')

    return { success: true, page }
  } catch (error) {
    await createLog('error', 'Failed to create page', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create page',
      status: 500
    }
  }
}
