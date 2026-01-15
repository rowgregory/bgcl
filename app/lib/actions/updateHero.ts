'use server'

import prisma from '@/prisma/client'
import { IUpdateHero } from '@/types/entities/hero'
import { createLog } from './createLog'
import { revalidateTag } from 'next/cache'

export async function updateHero(id: string, body: IUpdateHero) {
  try {
    const existingHero = await prisma.hero.findUnique({
      where: { id }
    })

    if (!existingHero) {
      await createLog('warn', 'Hero not found for update', {
        heroId: id
      })
      return { success: false, error: 'Hero not found', status: 404 }
    }

    const hero = await prisma.hero.update({
      where: { id },
      data: body
    })

    await createLog('info', 'Hero updated successfully', {
      heroId: hero.id,
      heroName: hero.name,
      updatedFields: Object.keys(body)
    })

    revalidateTag('Hero', 'default')

    return { success: true, hero }
  } catch (error) {
    await createLog('error', 'Failed to update hero', {
      error: error instanceof Error ? error.message : 'Unknown error',
      heroId: id
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update hero',
      status: 500
    }
  }
}
