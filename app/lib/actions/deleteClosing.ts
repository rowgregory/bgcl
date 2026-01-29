'use server'

import prisma from '@/prisma/client'
import { createLog } from './createLog'
import { revalidateTag } from 'next/cache'

export async function deleteClosing(id: string) {
  try {
    const closing = await prisma.closing.findUnique({
      where: { id },
      select: { id: true, date: true, title: true }
    })

    if (!closing) {
      return {
        success: false,
        error: 'Closing not found'
      }
    }

    await prisma.closing.delete({
      where: { id }
    })

    await createLog('info', 'Closing deleted', {
      closingId: id,
      date: closing.date,
      title: closing.title
    })

    revalidateTag('Closing', 'default')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete closing', {
      error: error instanceof Error ? error.message : 'Unknown error',
      closingId: id
    })

    return {
      success: false,
      error: 'Failed to delete closing. Please try again.'
    }
  }
}
