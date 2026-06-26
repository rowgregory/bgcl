import prisma from '@/prisma/client'
import { IUpdateTheme } from '@/types/entities/theme'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'

export async function updateTheme(data: IUpdateTheme) {
  try {
    await prisma.theme.update({
      where: { id: data.id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.dates && { dates: data.dates }),
        ...(data.order !== undefined && { order: data.order })
      }
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update theme', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update theme. Please try again.'
    }
  }
}
