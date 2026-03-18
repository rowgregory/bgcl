'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function reorderClubResources(
  clubResources: Array<{ id: string; order?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.all(
      clubResources.map((clubResource, index) =>
        prisma.resource.update({
          where: { id: clubResource.id },
          data: { order: index + 1 }
        })
      )
    )

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder club resources', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to reorder club resources' }
  }
}
