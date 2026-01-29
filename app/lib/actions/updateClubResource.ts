'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export interface UpdateClubResourceInput {
  id: string
  title: string
  url: string
  order?: number
}

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

    revalidateTag('Club-Resource', 'default')

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
