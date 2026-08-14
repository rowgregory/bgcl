import prisma from '@/prisma/client'
import { createLog } from '@/lib/actions/log/createLog'
import type { Partner } from '@prisma/client'

export const getPartners = async (): Promise<Partner[]> => {
  try {
    return await prisma.partner.findMany({
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    await createLog('error', 'Failed to fetch partners', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return []
  }
}
