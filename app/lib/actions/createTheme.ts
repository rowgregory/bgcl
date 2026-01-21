'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'
import { ICreateTheme } from '@/types/entities/theme'

export async function createTheme(data: ICreateTheme) {
  try {
    const theme = await prisma.theme.create({
      data: {
        title: data.title,
        dates: data.dates,
        order: data.order,
        programId: data.programId
      }
    })

    await createLog('info', 'Theme created successfully', {
      themeId: theme.id,
      programId: data.programId,
      title: theme.title
    })

    revalidateTag('Theme', 'default')

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create theme'

    await createLog('error', 'Failed to create theme', {
      error: errorMessage,
      inputData: {
        title: data.title,
        programId: data.programId
      }
    })

    throw new Error(errorMessage)
  }
}
