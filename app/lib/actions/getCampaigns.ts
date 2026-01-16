'use server'

import prisma from '@/prisma/client'

export async function getCampaigns() {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: {
        _count: {
          select: { orders: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return {
      success: true,
      campaigns,
      message: 'Campaigns retrieved successfully'
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve campaigns'
    return {
      success: false,
      error: errorMessage,
      campaigns: []
    }
  }
}
