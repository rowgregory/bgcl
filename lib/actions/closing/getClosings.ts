import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export const getClosings = async () => {
  try {
    const closings = await prisma.closing.findMany({
      orderBy: { order: 'asc' }
    })

    return { success: true, data: closings, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch closings', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load closings' }
  }
}
