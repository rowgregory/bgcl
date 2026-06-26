import prisma from '@/prisma/client'

export const getEventIds = async (): Promise<{
  success: boolean
  data?: { id: string; title: string }[]
  error?: string
}> => {
  try {
    const events = await prisma.event.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, data: events }
  } catch (error) {
    return { success: false, error: 'Failed to fetch event IDs' }
  }
}
