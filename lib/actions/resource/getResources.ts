import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export const getResources = async () => {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { order: 'asc' }
    })

    return resources
  } catch (error) {
    await createLog('error', 'Failed to fetch resources', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
