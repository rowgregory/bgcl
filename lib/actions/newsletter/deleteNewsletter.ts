'use server'

import prisma from '@/prisma/client'
import { createLog } from '../log/createLog'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/utils/requireAdmin'

export async function deleteNewsletter(id: string) {
  const auth = await requireAdmin()
  if (!auth.user) return { success: false, data: null, error: auth.error }

  try {
    const newsletter = await prisma.newsletter.findUnique({
      where: { id },
      select: { id: true, year: true, month: true }
    })

    if (!newsletter) {
      return {
        success: false,
        data: null,
        error: 'Newsletter not found'
      }
    }

    await prisma.newsletter.delete({
      where: { id }
    })

    await createLog('info', 'Newsletter deleted', {
      newsletterId: id,
      year: newsletter.year,
      month: newsletter.month
    })

    revalidatePath('/', 'layout')

    return { success: true }
  } catch (error) {
    await createLog('error', 'Failed to delete newsletter', {
      error: error instanceof Error ? error.message : 'Unknown error',
      newsletterId: id
    })

    return {
      success: false,
      data: null,
      error: 'Failed to delete newsletter. Please try again.'
    }
  }
}
