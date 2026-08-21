'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function deleteClosing(id: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

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

    revalidatePath('/', 'layout')

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
