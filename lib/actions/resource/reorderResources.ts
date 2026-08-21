'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function reorderResources(resources: Array<{ id: string; order?: number }>) {
  try {
    const auth = await requireAdmin()
    if (!auth.user) return { success: false, data: null, error: auth.error }

    await Promise.all(
      resources.map((resource, index) =>
        prisma.resource.update({
          where: { id: resource.id },
          data: { order: index + 1 }
        })
      )
    )

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder resources', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to reorder resources' }
  }
}
