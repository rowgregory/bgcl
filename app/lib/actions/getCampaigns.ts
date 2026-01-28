import prisma from '@/prisma/client'
import { ICampaign } from '@/types/entities/campaign'
import { unstable_cache } from 'next/cache'

export const getCampaigns = unstable_cache(
  async (isListed?: boolean): Promise<ICampaign[]> => {
    try {
      const campaigns = await prisma.campaign.findMany({
        where: isListed !== undefined ? { isListed } : undefined,
        orderBy: { order: 'asc' }
      })

      return campaigns
    } catch (error) {
      prisma.log.create({
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
  },
  ['getCampaigns'],
  { tags: ['Campaign'] }
)
