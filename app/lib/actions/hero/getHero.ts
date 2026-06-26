import prisma from '@/prisma/client'
import { IHero } from '@/types/entities/hero'

export const getHero = async (): Promise<{ success: boolean; data?: IHero; error?: string }> => {
  try {
    const hero = await prisma.hero.findFirst()
    return { success: true, data: hero as IHero }
  } catch (error) {
    return { success: false, error: 'Failed to fetch hero' }
  }
}
