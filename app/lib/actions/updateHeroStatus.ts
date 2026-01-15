'use server'

import { revalidateTag } from 'next/cache'
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
    const result = await prisma.$transaction(async (tx) => {
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

    await createLog('info', 'Hero status updated successfully', {
      heroId: result.id,
      heroTitle: result.title,
      previousStatus: hero.status,
      newStatus: result.status
    })

    revalidateTag('Hero', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update hero status', {
      error: error instanceof Error ? error.message : 'Unknown error',
      heroId: id
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update hero status',
      status: 500
    }
  }
}
