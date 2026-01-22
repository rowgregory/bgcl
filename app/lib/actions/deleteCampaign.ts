'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export async function deleteCampaign(id: string) {
  try {
    await prisma.campaign.delete({
      where: { id }
    })

    revalidateTag('Campaign', 'default')

    return {
      success: true,
      message: 'Campaign deleted successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to delete campaign',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          campaignId: id
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete campaign',
      message: 'Failed to delete campaign'
    }
  }
}
