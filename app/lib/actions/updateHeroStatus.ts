'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

type HeroStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED'

export async function updateHeroStatus(id: string, status: HeroStatus) {
  try {
    const hero = await prisma.hero.findUnique({
      where: { id }
    })

    if (!hero) {
      await createLog('warn', 'Hero not found for status update', {
        heroId: id
      })
      return { success: false, error: 'Hero not found', status: 404 }
    }

    // Use transaction to ensure atomicity - only one hero is active
    await prisma.$transaction(async (tx) => {
      // First, set all heroes to DRAFT
      await tx.hero.updateMany({
        where: { status: 'ACTIVE' },
        data: { status: 'DRAFT' }
      })

      // Then, activate the selected hero
      const activatedHero = await tx.hero.update({
        where: { id },
        data: { status: 'ACTIVE' }
      })

      return activatedHero
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update hero status', {
      error: error instanceof Error ? error.message : 'Unknown error',
      heroId: id
    })

    return {
      success: false,
      error: 'Failed to update hero status. Please try again.'
    }
  }
}
