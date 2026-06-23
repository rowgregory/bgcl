'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { UpdateClubResourceInput } from '@/types/entities/club-resource'
import { revalidatePath } from 'next/cache'

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

    revalidatePath('/', 'layout')

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
