'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'

export async function reorderResources(
  resources: Array<{ id: string; order?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
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
