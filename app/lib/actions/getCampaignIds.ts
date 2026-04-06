import prisma from '@/prisma/client'

export const getCampaignIds = async (): Promise<{
  success: boolean
  data?: { id: string; name: string }[]
  error?: string
}> => {
  try {
    const events = await prisma.campaign.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: events }
  } catch (error) {
    return { success: false, error: 'Failed to fetch campaign IDs' }
  }
}
