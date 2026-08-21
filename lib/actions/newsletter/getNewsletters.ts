import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'

export async function getNewsletters() {
  try {
    const newsletters = await prisma.newsletter.findMany({
      orderBy: { order: 'desc' }
    })

    return { success: true, data: newsletters, error: null }
  } catch (error) {
    await createLog('error', 'Failed to fetch newsletters', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return { success: false, data: null, error: 'Could not load newsletters' }
  }
}
