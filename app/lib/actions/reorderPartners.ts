'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function reorderPartners(
  partners: Array<{ id: string; order?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.all(
      partners.map((partner, index) =>
        prisma.partner.update({
          where: { id: partner.id },
          data: { order: index + 1 }
        })
      )
    )

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder partners', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to reorder partners. Please try again.' }
  }
}
