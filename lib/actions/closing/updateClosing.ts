'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { UpdateClosingInput } from '@/types/entities/closing'
import { revalidatePath } from 'next/cache'

export async function updateClosing(data: UpdateClosingInput) {
  try {
    await prisma.closing.update({
      where: { id: data.id },
      data: {
        title: data.title,
        date: data.date,
        order: data.order ?? 0
      }
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to update closing', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return {
      success: false,
      error: 'Failed to update closing. Please try again.'
    }
  }
}
