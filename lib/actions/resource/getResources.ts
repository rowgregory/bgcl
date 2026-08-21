import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export async function getResources() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { order: 'asc' }
    })

    return { success: true, data: resources, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch resources', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load resources' }
  }
}
