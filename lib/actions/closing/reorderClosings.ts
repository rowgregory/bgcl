'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function reorderClosings(closings: Array<{ id: string; order?: number }>) {
  try {
    const auth = await requireAdmin()
    if (!auth.user) return { success: false, data: null, error: auth.error }

    await Promise.all(
      closings.map((closing, index) =>
        prisma.closing.update({
          where: { id: closing.id },
          data: { order: index + 1 }
        })
      )
    )

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder closings', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Failed to reorder closings. Please try again.' }
  }
}
