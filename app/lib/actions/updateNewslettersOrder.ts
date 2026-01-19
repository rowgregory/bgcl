'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function updateNewslettersOrder(
  newsletters: Array<{ id: string; order?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.all(
      newsletters.map((newsletter, index) =>
        prisma.newsletter.update({
          where: { id: newsletter.id },
          data: { order: index + 1 }
        })
      )
    )

    revalidateTag('Newsletter', 'default')
    return { success: true }
  } catch (error) {
    console.error('Error reordering newsletters:', error)
    return { success: false, error: 'Failed to reorder newsletters' }
  }
}
