import { requireAdmin } from '@/lib/utils/requireAdmin'
import prisma from '@/prisma/client'

export const getCampaignIds = async (): Promise<{
  success: boolean
  data?: { id: string; name: string }[]
  error?: string
}> => {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const events = await prisma.campaign.findMany({
      select: { id: true, name: true },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: events, error: null }
  } catch (error) {
    return { success: false, data: null, error: 'Could not load campaign IDs' }
  }
}
