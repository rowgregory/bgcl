'use server'

// import { auth } from '@/auth'
import { createLog } from './createLog'
import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function updatePageBySlug(slug: string, content: any) {
  try {
    // const session = await auth()

    // if (!session?.user?.id) {
    //   await createLog('warn', 'Unauthorized page update attempt', {
    //     session,
    //     slug
    //   })
    //   return { success: false, error: 'Unauthorized', status: 401 }
    // }

    if (!content || typeof content !== 'object') {
      return {
        success: false,
        error: 'Content must be a valid object',
        status: 400
      }
    }

    const page = await prisma.page.update({
      where: { slug },
      data: { content }
    })

    await createLog('info', 'Page updated', {
      // userId: session.user.id,
      // userName: session.user.name,
      slug,
      pageId: page.id
    })

    revalidateTag('Page', 'default')

    return { success: true, page }
  } catch (error) {
    await createLog('error', 'Failed to update page', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update page',
      status: 500
    }
  }
}
