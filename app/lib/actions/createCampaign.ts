'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export interface CreateCampaignInput {
  name: string
  description: string
  image?: string
  goalAmount: number
  organizerName: string
  startDate: Date
  endDate?: Date
  isActive?: boolean
  externalLink?: string
}

export async function createCampaign(data: CreateCampaignInput) {
  try {
    await prisma.campaign.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image || null,
        goalAmount: data.goalAmount,
        organizerName: data.organizerName,
        startDate: data.startDate,
        endDate: data.endDate || null,
        isActive: data.isActive ?? true,
        externalLink: data.externalLink || null
      }
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
