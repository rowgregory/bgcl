'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function updateClubResourcesOrder(
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

    revalidateTag('Club-Resource', 'default')
    return { success: true }
  } catch (error) {
    console.error('Error reordering club resources:', error)
    return { success: false, error: 'Failed to reorder club resources' }
  }
}
