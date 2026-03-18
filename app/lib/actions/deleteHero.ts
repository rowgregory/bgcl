'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'

export async function deleteHero(id: string) {
  try {
    const hero = await prisma.hero.findUnique({
      where: { id }
    })

    // Prevent deleting active hero (optional - remove if you want to allow it)
    if (hero.status === 'ACTIVE') {
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

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete hero', {
      error: error instanceof Error ? error.message : 'Unknown error',
      heroId: id
    })

    return {
      success: false,
      error: 'Failed to delete hero. Please try again.'
    }
  }
}
