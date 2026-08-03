import prisma from '@/prisma/client'
import { CampaignWithCount } from '@/types/campaign.types'

export const getCampaigns = async (isPublic?: boolean): Promise<CampaignWithCount[]> => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: isPublic ? { isListed: true } : undefined,
      include: { _count: { select: { orders: true } } },
      orderBy: { order: 'asc' }
    })

    return campaigns
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to fetch campaigns',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    })

    return []
  }
}
