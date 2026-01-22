'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'

export interface UpdateClosingInput {
  id: string
  title: string
  date: string
  order: number
}

export async function updateClosing(data: UpdateClosingInput) {
  try {
    const closing = await prisma.closing.update({
      where: { id: data.id },
      data: {
        title: data.title,
        date: data.date,
        order: data.order ?? 0
      }
    })

    revalidateTag('Closing', 'default')

    return {
      success: true,
      data: closing,
      message: 'Closing updated successfully'
    }
  } catch (error) {
    await prisma.log.create({
      data: {
        level: 'error',
        message: 'Failed to update closing',
        metadata: JSON.stringify({
          error: error instanceof Error ? error.message : 'Unknown error',
          closingId: data.id
        })
      }
    })

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update closing',
      message: 'Failed to update closing'
    }
  }
}
