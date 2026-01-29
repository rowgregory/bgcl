'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export async function reorderClosings(
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
    await createLog('error', 'Failed to reorder closings', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to reorder closings. Please try again.' }
  }
}
