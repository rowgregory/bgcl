import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export const getCampaigns = async (isPublic?: boolean) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      where: isPublic ? { isListed: true } : undefined,
      include: { _count: { select: { orders: true } } },
      orderBy: { order: 'asc' }
    })

    return { success: true, data: campaigns, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch campaigns', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load campaigns' }
  }
}
