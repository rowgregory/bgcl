'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export async function reorderCampaigns(
  campaigns: Array<{ id: string; order?: number }>
): Promise<{ success: boolean; error?: string }> {
  try {
    await Promise.all(
      campaigns.map((campaign, index) =>
        prisma.campaign.update({
          where: { id: campaign.id },
          data: { order: index + 1 }
        })
      )
    )

    revalidateTag('Campaign', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder campaigns', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to reorder campaigns. Please try again.' }
  }
}
