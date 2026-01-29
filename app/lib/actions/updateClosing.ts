'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export interface UpdateClosingInput {
  id: string
  title: string
  date: string
  order: number
}

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

    revalidateTag('Closing', 'default')

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
