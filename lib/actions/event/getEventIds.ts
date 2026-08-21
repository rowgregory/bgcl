import { requireAdmin } from '@/lib/utils/requireAdmin'
import prisma from '@/prisma/client'

export const getEventIds = async (): Promise<{
  success: boolean
  data?: { id: string; title: string }[]
  error?: string
}> => {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const events = await prisma.event.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: events, error: null }
  } catch (error) {
    return { success: false, data: null, error: 'Failed to fetch event IDs' }
  }
}
