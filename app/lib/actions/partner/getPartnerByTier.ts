'use server'

import prisma from '@/prisma/client'
import type { PartnerTier } from '@prisma/client'
import { createLog } from '../log/createLog'

export const getPartnersByTier = async (tier: PartnerTier) => {
  try {
    const partners = await prisma.partner.findMany({
      where: { tier },
      orderBy: { order: 'asc' }
    })

    return partners
  } catch (error) {
    await createLog('error', 'Failed to fetch partners by tier', {
      tier,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return { success: false, data: [] }
  }
}
