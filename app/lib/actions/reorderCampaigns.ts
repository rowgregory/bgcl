'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { revalidatePath } from 'next/cache'

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

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to reorder campaigns', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, error: 'Failed to reorder campaigns. Please try again.' }
  }
}
