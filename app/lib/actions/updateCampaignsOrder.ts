'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function updateCampaignsOrder(
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
    console.error('Error reordering campaigns:', error)
    return { success: false, error: 'Failed to reorder campaigns' }
  }
}
