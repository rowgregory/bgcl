'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { revalidatePath } from 'next/cache'

export async function deleteCampaign(id: string) {
  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      select: { id: true, name: true }
    })

    if (!campaign) {
      return {
        success: false,
        error: 'Campaign not found'
      }
    }

    await prisma.campaign.delete({
      where: { id }
    })

    await createLog('info', 'Campaign deleted', {
      campaignId: id,
      campaignName: campaign.name
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete campaign', {
      error: error instanceof Error ? error.message : 'Unknown error',
      campaignId: id
    })

    return {
      success: false,
      error: 'Failed to delete campaign. Please try again.'
    }
  }
}
