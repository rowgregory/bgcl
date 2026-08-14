'use server'

import prisma from '@/prisma/client'
import type { Partner, PartnerTier } from '@prisma/client'
import { createLog } from '../log/createLog'

export const getPartnersByTier = async (tier: PartnerTier) => {
  try {
    const partners = await prisma.partner.findMany({
      where: { tier },
      orderBy: { order: 'asc' }
    })

    return partners as Partner[]
  } catch (error) {
    await createLog('error', 'Failed to fetch partners by tier', {
      tier,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}
