import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getClubResources = async () => {
  try {
    const clubResources = await prisma.resource.findMany({
      orderBy: { order: 'asc' }
    })

    return clubResources
  } catch (error) {
    await createLog('error', 'Failed to fetch club resources', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
