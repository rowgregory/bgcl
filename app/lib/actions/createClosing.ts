'use server'

import prisma from '@/prisma/client'
import { revalidateTag } from 'next/cache'
import { createLog } from './createLog'

export interface CreateClosingInput {
  title: string
  date: string
  order: number
}

export async function createClosing(data: CreateClosingInput) {
  try {
    const closing = await prisma.closing.create({
      data: {
        title: data.title,
        date: data.date,
        order: data.order ?? 0
      }
    })

    await createLog('info', 'Closing created', {
      closingId: closing.id,
      title: closing.title,
      date: closing.date
    })

    revalidateTag('Closing', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to create closing', {
      error: error instanceof Error ? error.message : 'Unknown error',
      title: data.title
    })

    return {
      success: false,
      error: 'Failed to create closing. Please try again.'
    }
  }
}
