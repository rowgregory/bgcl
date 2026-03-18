'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { ICreateTheme } from '@/types/entities/theme'

export async function createTheme(data: ICreateTheme) {
  try {
    // Get the highest order number
    const highestTheme = await prisma.theme.findFirst({
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const nextOrder = (highestTheme?.order ?? 0) + 1

    const theme = await prisma.theme.create({
      data: {
        title: data.title,
        dates: data.dates,
        order: nextOrder
      }
    })

    await createLog('info', 'Theme created successfully', {
      themeId: theme.id,
      title: theme.title,
      order: theme.order
    })

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create theme', {
      error: error instanceof Error ? error.message : 'Unknown error',
      title: data.title
    })

    return {
      success: false,
      error: 'Failed to create theme. Please try again.'
    }
  }
}
