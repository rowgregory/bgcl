import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getClosings = async () => {
  try {
    const closings = await prisma.closing.findMany({
      orderBy: { order: 'asc' }
    })

    return closings
  } catch (error) {
    await createLog('error', 'Failed to fetch closings', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
