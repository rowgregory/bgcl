'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function updateClosingsOrder(
  closings: Array<{ id: string; order?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.all(
      closings.map((closing, index) =>
        prisma.closing.update({
          where: { id: closing.id },
          data: { order: index + 1 }
        })
      )
    )

    revalidateTag('Closing', 'default')
    return { success: true }
  } catch (error) {
    console.error('Error reordering closings:', error)
    return { success: false, error: 'Failed to reorder closings' }
  }
}
