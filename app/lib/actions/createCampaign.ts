'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { trimAndTransformData } from '../utils/trimAndTransformData'
import { createLog } from './createLog'

export interface CreateCampaignInput {
  name: string
  description: string
  image?: string
  goalAmount: number
  currentAmount: number
  organizerName: string
  startDate: Date
  endDate?: Date
  isActive: boolean
  isListed: boolean
  externalLink?: string
}

export async function createCampaign(data: CreateCampaignInput) {
  try {
    const processedData = trimAndTransformData(data, {
      dateFields: ['startDate', 'endDate'],
      numberFields: ['goalAmount', 'currentAmount'],
      nullableFields: ['image', 'externalLink', 'endDate'],
      ignoreFields: ['id', 'createdAt', 'updatedAt']
    })

    const campaign = await prisma.campaign.create({
      data: processedData
    })

    await createLog('info', 'Campaign created', {
      campaignId: campaign.id,
      name: campaign.name,
      goalAmount: campaign.goalAmount
    })

    revalidateTag('Campaign', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create campaign', {
      error: error instanceof Error ? error.message : 'Unknown error',
      name: data.name
    })

    return {
      success: false,
      error: 'Failed to create campaign. Please try again.'
    }
  }
}
