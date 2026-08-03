'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '../../utils/log.utils'
import { revalidatePath } from 'next/cache'
import { campaignSchema } from '@/lib/validations/campaign.validation'

export async function createCampaign(input: unknown) {
  // Validate on the server too — never trust the client
  const parsed = campaignSchema.safeParse(input)

  console.log('PARSED: ', parsed)

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid campaign data'
    }
  }

  const v = parsed.data

  try {
    const campaign = await prisma.campaign.create({
      data: {
        ...v,
        startDate: new Date(v.startDate),
        endDate: v.endDate ? new Date(v.endDate) : null,
        externalLink: v.externalLink || null
      }
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
      name: v.name
    })

    return {
      success: false,
      error: 'Failed to create campaign. Please try again.'
    }
  }
}
