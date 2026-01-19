'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

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

    return {
      success: true,
      message: 'Club resource updated successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to update club resource',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          clubResourceId: data.id
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update club resource',
      message: 'Failed to update club resource'
    }
  }
}
