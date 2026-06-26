import prisma from '@/prisma/client'

export async function getLogStats() {
  try {
    const [total, errorCount, warningCount, infoCount] = await Promise.all([
      prisma.log.count(),
      prisma.log.count({ where: { level: 'error' } }),
      prisma.log.count({ where: { level: 'warning' } }),
      prisma.log.count({ where: { level: 'info' } })
    ])

    return { total, errorCount, warningCount, infoCount }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch stats',
      stats: null
    }
  }
}
