import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export async function getCampaignById(id: string) {
  if (!id) return { success: false, data: null, error: 'Campaign ID is required' }

  try {
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        orders: {
          where: { status: 'CONFIRMED' },
          select: {
            id: true,
            totalAmount: true,
            customerName: true,
            customerEmail: true,
            createdAt: true
          }
        },
        _count: {
          select: { orders: true }
        }
      }
    })

    if (!campaign) return { success: false, data: null, error: 'Campaign not found' }

    return {
      success: true,
      data: campaign,
      message: 'Campaign retrieved successfully'
    }
  } catch (error) {
    await createLog('error', 'Failed to fetch campaign by id', {
      error: error instanceof Error ? error.message : 'Unknown error',
      campaignId: id
    })

    return { success: false, data: null, error: 'Could not load campaign' }
  }
}
