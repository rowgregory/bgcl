import prisma from '@/prisma/client'

export async function getCampaignById(id: string) {
  try {
    if (!id) {
      throw new Error('Campaign ID is required')
    }

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

    if (!campaign) {
      throw new Error('Campaign not found')
    }

    return {
      success: true,
      campaign,
      message: 'Campaign retrieved successfully'
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve campaign'
    return {
      success: false,
      error: errorMessage,
      campaign: null
    }
  }
}
