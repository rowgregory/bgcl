'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { trimAndTransformData } from '../utils/trimAndTransformData'

export interface UpdateCampaignInput {
  id: string
  name: string
  description: string
  image?: string
  goalAmount: number
  currentAmount: number
  organizerName: string
  startDate: Date
  endDate?: Date
  isActive?: boolean
  isListed?: boolean
  externalLink?: string
}

export async function updateCampaign(data: UpdateCampaignInput) {
  try {
    if (!data.id) {
      throw new Error('Campaign ID is required')
    }

    const campaignId = data.id

    // Process and trim data
    const processedData = trimAndTransformData(data, {
      dateFields: ['startDate', 'endDate'],
      numberFields: ['goalAmount', 'currentAmount'],
      nullableFields: ['image', 'externalLink', 'endDate'],
      ignoreFields: ['id', 'createdAt', 'updatedAt', 'isUpdating']
    })

    // Filter out empty values
    const cleanData = Object.entries(processedData).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    }, {} as any)

    if (Object.keys(cleanData).length === 0) {
      throw new Error('No valid data to update')
    }

    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
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
