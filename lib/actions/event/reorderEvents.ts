'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function reorderEvents(events: Array<{ id: string; order?: number }>) {
  try {
    const auth = await requireAdmin()
    if (!auth.user) return { success: false, data: null, error: auth.error }

    await Promise.all(
      events.map((event, index) =>
        prisma.event.update({
          where: { id: event.id },
          data: { order: index + 1 }
        })
      )
    )

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder events', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Failed to reorder events. Please try again.' }
  }
}
