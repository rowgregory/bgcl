'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function reorderCampaigns(campaigns: Array<{ id: string; order?: number }>) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

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

    return { success: false, data: null, error: 'Failed to reorder campaigns. Please try again.' }
  }
}
