'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { ICreateTheme } from '@/types/entities/theme'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function createTheme(data: ICreateTheme) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

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

    revalidatePath('/', 'layout')

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
