'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { UpdateClubResourceInput } from '@/types/entities/club-resource'

export async function updateClubResource(data: UpdateClubResourceInput) {
  try {
    await prisma.resource.update({
      where: { id: data.id },
      data: {
        title: data.title,
        url: data.url || null,
        order: data.order ?? 0
      }
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update club resource', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update club resource. Please try again.'
    }
  }
}
