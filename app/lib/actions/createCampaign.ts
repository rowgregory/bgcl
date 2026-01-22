'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { trimAndTransformData } from '../utils/trimAndTransformData'

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

    await prisma.campaign.create({
      data: processedData
    })

    revalidateTag('Campaign', 'default')

    return {
      success: true,
      message: 'Campaign created successfully'
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create campaign'
    return {
      success: false,
      error: errorMessage
    }
  }
}
