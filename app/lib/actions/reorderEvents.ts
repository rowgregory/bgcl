'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function reorderEvents(
  events: Array<{ id: string; order?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.all(
      events.map((closing, index) =>
        prisma.event.update({
          where: { id: closing.id },
          data: { order: index + 1 }
        })
      )
    )

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder events', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to reorder events. Please try again.' }
  }
}
