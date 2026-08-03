'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { getActor } from '../user/getActor'
import { buildLogMessage, getRequestContext } from '../../utils/log.utils'
import { revalidatePath } from 'next/cache'
import { campaignSchema } from '@/lib/validations/campaign.validation'

export async function updateCampaign(id: string, input: unknown) {
  if (!id) {
    return { success: false, error: 'Campaign ID is required.' }
  }

  // Validate on the server too — never trust the client
  const parsed = campaignSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid campaign data'
    }
  }

  const v = parsed.data

  try {
    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...v,
        startDate: new Date(v.startDate),
        endDate: v.endDate ? new Date(v.endDate) : null,
        externalLink: v.externalLink || null
      }
    })

    const [actor, context] = await Promise.all([getActor(), getRequestContext()])
    const message = await buildLogMessage('updated a campaign', actor, context)

    await createLog('info', message, {
      campaignId: campaign.id,
      name: campaign.name,
      goalAmount: campaign.goalAmount,
      ...context
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update campaign', {
      campaignId: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update campaign. Please try again.'
    }
  }
}
