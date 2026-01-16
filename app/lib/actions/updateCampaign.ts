'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function updateCampaign(id: string, data: any) {
  try {
    if (!id) {
      throw new Error('Campaign ID is required')
    }

    // Filter out system fields that shouldn't be updated
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '' && !['id', 'createdAt', 'updatedAt'].includes(key)) {
        acc[key] = value
      }
      return acc
    }, {} as any)

    if (Object.keys(cleanData).length === 0) {
      throw new Error('No valid data to update')
    }

    const campaign = await prisma.campaign.update({
      where: { id },
      data: cleanData
    })

    revalidateTag('Campaign', 'default')

    return {
      success: true,
      campaign,
      message: 'Campaign updated successfully'
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update campaign'
    return {
      success: false,
      error: errorMessage
    }
  }
}
