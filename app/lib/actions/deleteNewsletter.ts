'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function deleteNewsletter(id: string) {
  try {
    await prisma.newsletter.delete({
      where: { id }
    })

    revalidateTag('Newsletter', 'default')

    return {
      success: true,
      message: 'Newsletter deleted successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to delete newsletter',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          newsletterId: id
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete newsletter'
    }
  }
}
