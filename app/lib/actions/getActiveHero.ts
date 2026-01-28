import prisma from '@/prisma/client'
import { createLog } from './createLog'

export const getActiveHero = async () => {
  try {
    const hero = await prisma.hero.findFirst({
      where: { status: 'ACTIVE' }
    })

    return hero
  } catch (error) {
    await createLog('error', 'Failed to fetch active hero', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
