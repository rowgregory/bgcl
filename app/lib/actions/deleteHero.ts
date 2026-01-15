'use server'

import { revalidateTag } from 'next/cache'
import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function deleteHero(id: string) {
  try {
    const hero = await prisma.hero.findUnique({
      where: { id }
    })

    if (!hero) {
      await createLog('warn', 'Hero not found for deletion', {
        heroId: id
      })
      return { success: false, error: 'Hero not found', status: 404 }
    }

    // Prevent deleting active hero (optional - remove if you want to allow it)
    if (hero.status === 'ACTIVE') {
      await createLog('warn', 'Cannot delete active hero', {
        heroId: id,
        heroName: hero.name
      })
      return {
        success: false,
        error: 'Cannot delete active hero. Please activate another hero first.'
      }
    }

    await prisma.hero.delete({
      where: { id }
    })

    await createLog('info', 'Hero deleted successfully', {
      heroId: hero.id,
      heroTitle: hero.title
    })

    revalidateTag('Hero', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete hero', {
      error: error instanceof Error ? error.message : 'Unknown error',
      heroId: id
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete hero',
      status: 500
    }
  }
}
