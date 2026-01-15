import prisma from '@/prisma/client'
import { IHeroEntity } from '@/types/entities/hero'
import { unstable_cache } from 'next/cache'

// Create a cached function for SSR - React will dedupe this across the request
export const getActiveHero = unstable_cache(
  async (): Promise<IHeroEntity | null> => {
    try {
      const hero = await prisma.hero.findFirst({
        where: { status: 'ACTIVE' }
      })

      return hero
    } catch (error) {
      // Log async without blocking the response
      prisma.log
        .create({
          data: {
            level: 'error',
            message: 'Failed to fetch active hero',
            metadata: JSON.stringify({
              error: error instanceof Error ? error.message : 'Unknown error'
            })
          }
        })
        .catch(() => {}) // Fire and forget

      return null
    }
  },
  ['getActiveHero'],
  { tags: ['Hero'] }
)
