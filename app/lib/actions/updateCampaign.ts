'use server'

import prisma from '@/prisma/client'
import { trimAndTransformData } from '../utils/trimAndTransformData'
import { createLog } from './createLog'
import { UpdateCampaignInput } from '@/types/entities/campaign'

export async function updateCampaign(data: UpdateCampaignInput) {
  try {
    const campaignId = data.id

    if (!campaignId) {
      return {
        success: false,
        error: 'Campaign ID is required.'
      }
    }

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

    await prisma.campaign.update({
      where: { id: campaignId },
      data: cleanData
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update update', {
      error: error instanceof Error ? error.message : 'Failed to update campaign'
    })

    return {
      success: false,
      error: 'Failed to update campaign. Please try again.'
    }
  }
}
