import prisma from '@/prisma/client'
import { IHeroEntity } from '@/types/entities/hero'
import { unstable_cache } from 'next/cache'

export const getHeroes = unstable_cache(
  async (): Promise<IHeroEntity[] | null> => {
    try {
      const heroes = await prisma.hero.findMany()

      return heroes
    } catch (error) {
      await prisma.log.create({
        data: {
          level: 'error',
          message: 'Failed to fetch heroes',
          metadata: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      })

      return null
    }
  },
  ['getHeroes'],
  { tags: ['Hero'] }
)
