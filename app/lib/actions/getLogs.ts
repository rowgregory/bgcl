import prisma from '@/prisma/client'

export async function getLogs(filters?: { level?: string; userId?: string; startDate?: Date; endDate?: Date }) {
  try {
    const logs = await prisma.log.findMany({
      where: {
        ...(filters?.level && { level: filters.level }),
        ...(filters?.userId && { userId: filters.userId }),
        ...(filters?.startDate &&
          filters?.endDate && {
            createdAt: {
              gte: filters.startDate,
              lte: filters.endDate
            }
          })
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100 // Limit to last 100 logs
    })

    return logs
  } catch (error) {
    console.error('Error fetching logs:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch logs',
      data: []
    }
  }
}
