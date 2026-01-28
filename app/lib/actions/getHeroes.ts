import prisma from '@/prisma/client'
import { IHeroEntity } from '@/types/entities/hero'
import { createLog } from './createLog'

export const getHeroes = async (): Promise<IHeroEntity[] | null> => {
  try {
    const heroes = await prisma.hero.findMany()

    return heroes
  } catch (error) {
    await createLog('error', 'Failed to fetch heroes', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    throw error
  }
}
