'use server'

import prisma from '@/prisma/client'
import { trimAndTransformData } from '../../utils/trimAndTransformData'
import { createLog } from '../log/createLog'
import { CreateCampaignInput } from '@/types/entities/campaign'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '../../utils/log.utils'
import { revalidatePath } from 'next/cache'

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

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])
    const message = await buildLogMessage('created a campaign', actor, context)

    await createLog('info', message, {
      campaignId: campaign.id,
      name: campaign.name,
      goalAmount: campaign.goalAmount,
      ...context
    })

    revalidatePath('/', 'layout')

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
